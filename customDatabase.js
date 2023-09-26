import { Prisma } from '@prisma/client';
import { BaseDatabase } from 'adminjs';
import { CustomResource } from './customResource.js';
export class Database extends BaseDatabase {
    client;
    clientModule;
    rest;
    constructor(args) {
        super(args);
        const { client, clientModule, ...rest } = args;
        this.client = client;
        this.clientModule = clientModule;
        this.rest = rest;
    }
    resources() {
        const dmmf = this.clientModule?.Prisma.dmmf.datamodel ?? Prisma.dmmf.datamodel;
        if (!dmmf?.models)
            return [];
        return dmmf.models.map((model) => {
            const resource = new CustomResource({ model, client: this.client, ...this.rest });
            return resource;
        });
    }
    static isAdapterFor(args) {
        const { clientModule } = args;
        const dmmf = clientModule?.Prisma.dmmf.datamodel ?? Prisma.dmmf.datamodel;
        return dmmf?.models?.length > 0;
    }
}
//# sourceMappingURL=customDatabase.js.map