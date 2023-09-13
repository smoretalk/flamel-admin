import { Resource } from '@adminjs/prisma';
import { BaseRecord } from 'adminjs';
export class CustomResource extends Resource {
    titleField() {
        return this.decorate().titleProperty().name();
    }
    wrapObjects(objects) {
        return objects.map((sequelizeObject) => new BaseRecord(sequelizeObject.toJSON(), this));
    }
    async findRelated(record, resource, options = {}) {
    }
    async saveRecords(record, resourceId, ids) {
        await this.update(record.params.id, {
            [resourceId]: ids.map((value) => ({ id: value.id })),
        });
    }
    primaryKeyField() {
        return this.id;
    }
    getManyReferences() {
        return this.decorate()
            .getProperties({ where: 'edit' })
            .filter((p) => {
            return p.type() === 'reference';
        })
            .map((p) => p.reference());
    }
    getManyProperties() {
        return this.decorate()
            .getProperties({ where: 'edit' })
            .filter((p) => {
            return p.type() === 'reference';
        })
            .map((p) => p.name());
    }
}
//# sourceMappingURL=customResource.js.map