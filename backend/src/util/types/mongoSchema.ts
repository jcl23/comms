import mongoose from "mongoose";

export type ConstructorOf<T> =
    T extends string ? typeof mongoose.Schema.Types.String :
    T extends number ? typeof mongoose.Schema.Types.Number :
    T extends boolean ? typeof mongoose.Schema.Types.Boolean :
    T extends Date ? typeof mongoose.Schema.Types.Date :
    never;

export type MongoSchemaType<T> =
    T extends string ? { type: typeof mongoose.Schema.Types.String, required?: boolean } :
    T extends number ? { type: typeof mongoose.Schema.Types.Number, required?: boolean } :
    T extends boolean ? { type: typeof mongoose.Schema.Types.Boolean, required?: boolean } :
    T extends Date ? { type: typeof mongoose.Schema.Types.Date, required?: boolean } :
    T extends Array<infer U> ? { type: ConstructorOf<U>[], required?: boolean } :
    { type: typeof mongoose.Schema.Types.String | typeof mongoose.Schema.Types.Number | typeof mongoose.Schema.Types.Boolean | [MongoSchemaType<any>], required?: boolean };

type Validate<U> = {
    validator: (v: U) => boolean;
    message: string | ((props: {value: U}) => string);
};

export type MongoSchemaFor<T> = {
    [K in keyof T]: MongoSchemaType<T[K]> & {validate?: Validate<K>};
};
