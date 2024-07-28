import { Schema } from "mongoose";

export type ConstructorOf<T> =
    T extends string ? typeof Schema.Types.String :
    T extends number ? typeof Schema.Types.Number :
    T extends boolean ? typeof Schema.Types.Boolean :
    T extends Date ? typeof Schema.Types.Date :
    T extends Array<infer U> ? [ConstructorOf<U>] :
    T extends object ? Schema.Types.Mixed :
    never;

export type MongoSchemaType<T> =
    T extends string ? { type: typeof Schema.Types.String, required?: boolean } :
    T extends number ? { type: typeof Schema.Types.Number, required?: boolean } :
    T extends boolean ? { type: typeof Schema.Types.Boolean, required?: boolean } :
    T extends Date ? { type: typeof Schema.Types.Date, required?: boolean } :
    T extends Array<infer U> ? { type: ConstructorOf<U>[], required?: boolean } :
    IsUnion<T> extends true ? { type: typeof Schema.Types.Mixed, required?: boolean } :
    T extends object ? { type: Schema.Types.Mixed, required?: boolean } :
    never;
    //{ type: typeof Schema.Types.String | typeof Schema.Types.Number | typeof Schema.Types.Boolean | [MongoSchemaType<any>], required?: boolean };

type IsUnion<T> = (T extends any ? (x: T) => void : never) extends ((x: infer U) => void) ? [T] extends [U] ? false : true : false;



type Validate<U> = {
    validator: (v: U) => boolean;
    message: string | ((props: {value: U}) => string);
};



export type MongoSchemaFor<T> = {
    [K in keyof T]: MongoSchemaType<T[K]> & {validate?: Validate<T[K]>};
};
