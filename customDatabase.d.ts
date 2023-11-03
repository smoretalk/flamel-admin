import { BaseDatabase } from 'adminjs';
import { CustomResource } from './customResource.js';
import type { DMMF } from '@prisma/client/runtime/library.js';
type ClientModule = {
    Prisma: {
        dmmf: DMMF.Document;
    };
};
export declare class Database extends BaseDatabase {
    client: any;
    clientModule: ClientModule;
    rest: object;
    constructor(args: {
        client: any;
        clientModule: ClientModule;
    });
    resources(): CustomResource[];
    static isAdapterFor(args: {
        clientModule: ClientModule;
    }): boolean;
}
export {};
