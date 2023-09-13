import { Resource } from '@adminjs/prisma';
import { BaseResource } from 'adminjs';
export declare class CustomResource extends Resource {
    titleField(): string;
    wrapObjects(objects: any): any;
    findRelated(record: any, resource: CustomResource, options?: {}): Promise<void>;
    saveRecords(record: any, resourceId: any, ids: {
        id: string | number;
    }[]): Promise<void>;
    primaryKeyField(): () => string;
    getManyReferences(): BaseResource[];
    getManyProperties(): string[];
}
