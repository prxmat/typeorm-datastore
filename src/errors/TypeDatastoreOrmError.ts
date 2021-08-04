export class TypeDatastoreOrmError extends Error {
  public name = "TypeDatastoreOrmError";

  constructor(message: string) {
      super(message);
      Object.setPrototypeOf(this, TypeDatastoreOrmError.prototype);
  }
}