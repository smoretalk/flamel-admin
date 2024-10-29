import { BaseResource, Filter, FlattenParams, ParamsType } from 'adminjs';
import { type Enums } from "@adminjs/prisma";
import type { DMMF } from '@prisma/client/runtime/library.js';
import { Property } from "./customProperty.js";
import CustomRecord from "./customRecord.js";
type ReadonlyDeep_2<O> = {
    +readonly [K in keyof O]: ReadonlyDeep_2<O[K]>;
};
export declare const lowerCase: (name: string) => string;
export declare const getEnums: (clientModule?: {
    Prisma: {
        dmmf: DMMF.Document;
    };
}) => {
    [key: string]: {
        readonly name: string;
        readonly values: readonly {
            readonly name: string;
            readonly dbName: string | null;
        }[];
        readonly dbName?: string | null;
        readonly documentation?: string;
    };
};
type Args = {
    model: DMMF.Model;
    client: any;
    clientModule?: {
        Prisma: {
            dmmf: DMMF.Document;
        };
    };
    include?: object;
    depModels?: {
        alias: string;
        model: DMMF.Model;
    }[];
};
export declare class CustomResource extends BaseResource {
    model: DMMF.Model;
    client: any;
    enums: Enums;
    manager: any;
    propertiesObject: {
        [key: string]: Property;
    };
    include: object;
    depModels: ReadonlyDeep_2<{}>;
    depModelsObject: {
        [k: string]: Property;
    }[];
    constructor(args: Args);
    databaseName(): string;
    databaseType(): string;
    id(): string;
    properties(): Property[];
    property(path: string): Property;
    build(params: object): CustomRecord;
    count(filter: Filter): Promise<any>;
    find(filter: Filter, params?: {
        limit?: number;
        offset?: number;
        sort?: {
            direction?: string;
            sortBy?: string;
        };
    }): Promise<CustomRecord[]>;
    findOne(id: string): Promise<CustomRecord>;
    findMany(ids: string[]): Promise<CustomRecord[]>;
    create(params: FlattenParams): Promise<{
        [k: string]: unknown;
    }>;
    update(pk: unknown, params?: {}): Promise<{
        [k: string]: unknown;
    }>;
    delete(id: string): Promise<void>;
    static isAdapterFor(args: Args): boolean;
    prepareProperties(): {
        [k: string]: Property;
    };
    prepareDepModelProperties(modelObj: {
        alias: string;
        model: DMMF.Model;
    }): {
        [k: string]: Property;
    };
    prepareParams(params: FlattenParams): unknown;
    isNonArrayObject(target: object): boolean;
    prepareReturnValues(params: FlattenParams): {
        [k: string]: unknown;
    };
    titleField(): string;
    wrapObjects(objects: {
        toJSON(): ParamsType;
    }[]): CustomRecord[];
    saveRecord(where: object, resourceId: string, ids: {
        imageId: number;
    }): Promise<void>;
    saveRecords(key: string, idValue: string, resourceId: string, targetKey: string, ids: {
        id: string | number;
    }[]): Promise<void>;
    primaryKeyField(): () => string;
    getManyReferences(): BaseResource[];
    getManyProperties(): import("adminjs").PropertyDecorator[];
}
export {};
