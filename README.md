# typeorm-datastore


# Example: define Entity
```typescript
import { BaseEntity, CompositeIndex, CompositeIndexExporter, createConnection, Entity, Field, 
typeDatastoreOrm, TypeDatastoreOrmError, BeforeDelete, BeforeInsert, BeforeUpdate, BeforeUpsert, AfterLoad} from "typeorm-datastore";

@CompositeIndex({_id: "desc"})
@Entity({namespace: "testing", kind: "User", enumerable: true})
export class User extends BaseEntity {
    @Field({generateId: true})
    public _id: number = 0;

    @Field()
    public date: Date = new Date();

    @Field({index: true})
    public string: string = "";

    @Field()
    public number: number = 10;

    @Field()
    public buffer: Buffer = Buffer.alloc(1);

    @Field()
    public array: number[] = [];

    @Field({index: true, excludeFromIndexes: ["object.name"]})
    public object: any = {};
}

@CompositeIndex({number: "desc", name: "desc"})
@CompositeIndex({_id: "desc"})
@Entity() // namespace: default, kind: same as class name
export class TaskGroup extends BaseEntity {
    @Field({generateId: true})
    public _id: number = 0;

    @Field()
    public name: string = "";

    @Field()
    public number: number = 0;

    @AfterLoad()
    @BeforeInsert()
    @BeforeUpsert()
    @BeforeUpdate()
    @BeforeDelete()
    public hook(type: string) {
        // you can update the entity after certain events happened
    }
}
```


# Example: general
```typescript
async function examples() {
    const connection = await createConnection({keyFilename: "./datastoreServiceAccount.json"});
    const repository = connection.getRepository(User, {namespace: "mynamespace", kind: "NewUser"});
    const taskGroupRepository = connection.getRepository(TaskGroup);

    const user1 = repository.create();
    await repository.insert(user1);
    const key = user1.getKey(); // the native datastore key

    // simple query
    const findUser1 = repository.findOne(user1._id);

    // find users
    const users = await repository
        .query()
        .filter("_id", x => x.gt(5))
        .limit(100)
        .findMany();

    // get id
    const ids = await repository.allocateIds(10);

    // remove all data
    await repository.truncate();
}
```

# Example: admin
```typescript
async function adminExamples() {
    const connection = await createConnection({clientEmail: "", privateKey: ""});
    const myAdmin = connection.getAdmin();
    const namespaces = await myAdmin.getNamespaces();
    const kinds = await myAdmin.getKinds();
}
```

# Example: query
```typescript
async function queryExamples() {
    const connection = await createConnection({clientEmail: "", privateKey: ""});
    const userRepository = connection.getRepository(User);
    const user = userRepository.create({_id: 1});

    const findUser1 = await userRepository.query().findOne();
    const findUsers2 = await userRepository.findMany([1, 2, 3, 4, 5]);
    const findUsers3 = await userRepository.query().filter("_id", x => x.ge(1).lt(6)).findMany();
    const findUsers4 = await userRepository.query().limit(10).offset(3).order("number", {descending: true}).findMany();

    // complex query with strong type
    const query1 = userRepository.query()
        .filter("number", 10)
        .setAncestorKey(user.getKey())
        .groupBy("number")
        .order("number", {descending: true})
        .offset(5)
        .limit(10);

    // complex query with strong type
    const query = userRepository.query({weakType: true})
        .filter("object.name", 10)
        .setAncestorKey(user.getKey())
        .groupBy("object.name")
        .order("object.name", {descending: true})
        .offset(5)
        .limit(10);

    // iterator
    const batch = 500;
    const iterator = userRepository.query().limit(batch).getAsyncIterator();
    for await (const entities of iterator) {
        if (entities.length === batch) {
            // true
        }
    }

    // select key query
    // this can save some query cost and also return faster
    const keys = await userRepository.selectKeyQuery().findMany();
}
```
