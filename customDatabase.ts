/* eslint-disable class-methods-use-this */
import { Prisma } from '@prisma/client';
import { BaseDatabase } from 'adminjs';
import { CustomResource } from './customResource.js';
export class Database extends BaseDatabase {
  client;
  clientModule;
  rest: any[];
  constructor(args) {
    super(args);
    const { client, clientModule, ...rest } = args;
    this.client = client;
    this.clientModule = clientModule;
    this.rest = rest;
  }
  override resources() {
    const dmmf = this.clientModule?.Prisma.dmmf.datamodel ?? (Prisma as any).dmmf.datamodel;
    if (!dmmf?.models)
      return [];
    return dmmf.models.map((model) => {
      const resource = new CustomResource({ model, client: this.client, ...this.rest });
      return resource;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static override isAdapterFor(args) {
    const { clientModule } = args;
    const dmmf = clientModule?.Prisma.dmmf.datamodel ?? (Prisma as any).dmmf.datamodel;
    return dmmf?.models?.length > 0;
  }
}
//# s
