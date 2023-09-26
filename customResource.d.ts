import { BaseRecord, BaseResource } from 'adminjs';
import { type Enums } from "@adminjs/prisma";
import type { DMMF } from '@prisma/client/runtime/library.js';
import { type PrismaClient } from '@prisma/client';
import { Property } from "./customProperty.js";
export declare const lowerCase: (name: any) => any;
export declare class CustomResource extends BaseResource {
    model: DMMF.Model;
    client: PrismaClient;
    enums: Enums;
    manager: any;
    propertiesObject: {
        [key: string]: Property;
    };
    include: any;
    depModels: any;
    depModelsObject: any;
    constructor(args: {
        model: DMMF.Model;
        client: PrismaClient;
        clientModule?: any;
        include?: object;
        depModels?: DMMF.Model[];
    });
    databaseName(): string;
    databaseType(): string;
    id(): string;
    properties(): Property[];
    property(path: any): Property;
    build(params: any): BaseRecord;
    count(filter: any): Promise<any>;
    find(filter: any, params?: {
        limit?: number;
        offset?: number;
        sort?: {
            direction?: string;
            sortBy?: string;
        };
    }): Promise<any>;
    findOne(id: any): any;
    findMany(ids: any): Promise<any>;
    create(params: any): Promise<{}>;
    update(pk: any, params?: {}): Promise<{}>;
    delete(id: any): Promise<void>;
    static isAdapterFor(args: any): boolean;
    prepareProperties(): {};
    prepareDepModelProperties(model: any): any;
    prepareParams(params: any): {};
    isNonArrayObject(target: any): boolean;
    prepareReturnValues(params: any): {};
    titleField(): string;
    wrapObjects(objects: any): any;
    findRelated(record: any, resource: CustomResource, options?: {}): Promise<void>;
    saveRecord(where: any, resourceId: any, ids: any): Promise<void>;
    saveRecords(key: any, idValue: any, resourceId: any, targetKey: any, ids: {
        id: string | number;
    }[]): Promise<void>;
    primaryKeyField(): () => string;
    getManyReferences(): BaseResource[];
    getManyProperties(): import("adminjs").PropertyDecorator[];
}
