import { BaseRecord, BaseResource, Filter, FlattenParams, ParamsType } from 'adminjs';
import { type Enums } from "@adminjs/prisma";
import type { DMMF } from '@prisma/client/runtime/library.js';
import { type PrismaClient } from '@prisma/client';
import { Property } from "./customProperty.js";
export declare const lowerCase: (name: string) => string;
type Args = {
    model: DMMF.Model;
    client: PrismaClient;
    clientModule?: any;
    include?: object;
    depModels?: DMMF.Model[];
};
export declare class CustomResource extends BaseResource {
    model: DMMF.Model;
    client: PrismaClient;
    enums: Enums;
    manager: any;
    propertiesObject: {
        [key: string]: Property;
    };
    include: object;
    depModels: DMMF.Model[];
    depModelsObject: {
        [k: string]: Property;
    }[];
    constructor(args: Args);
    databaseName(): string;
    databaseType(): string;
    id(): string;
    properties(): Property[];
    property(path: string): Property;
    build(params: object): BaseRecord;
    count(filter: Filter): Promise<any>;
    find(filter: Filter, params?: {
        limit?: number;
        offset?: number;
        sort?: {
            direction?: string;
            sortBy?: string;
        };
    }): Promise<BaseRecord[]>;
    findOne(id: string): Promise<BaseRecord>;
    findMany(ids: string[]): Promise<BaseRecord[]>;
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
    prepareDepModelProperties(model: DMMF.Model): {
        [k: string]: Property;
    };
    prepareParams(params: FlattenParams): {
        [k: string]: unknown;
    };
    isNonArrayObject(target: object): boolean;
    prepareReturnValues(params: FlattenParams): {
        [k: string]: unknown;
    };
    titleField(): string;
    wrapObjects(objects: {
        toJSON(): ParamsType;
    }[]): BaseRecord[];
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
