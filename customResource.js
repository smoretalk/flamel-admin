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
    async saveRecord(record, resourceId, ids) {
        const update = ids;
        const create = {
            ...ids,
        };
        delete update.id;
        delete create.id;
        if (resourceId === 'GenerationInfo') {
            delete create.imageId;
            delete update.imageId;
        }
        await this.manager.update({
            where: { id: record.params.id },
            data: {
                [resourceId]: {
                    upsert: {
                        create,
                        update,
                    }
                }
            }
        });
    }
    async saveRecords(record, resourceId, ids) {
        console.log('record', record.params.id, 'resourceId', resourceId, 'ids', ids);
        if (resourceId.includes('.')) {
            const split = resourceId.split('.');
            const middle = split[0];
            const last = split[1];
            const result = await this.manager.findFirst({
                where: {
                    id: record.params.id,
                },
                include: {
                    [middle]: true,
                }
            });
            if (result?.[middle]) {
                const lowerCase = (name) => name.substring(0, 1).toLowerCase() + name.substring(1);
                const middleId = result[middle].id;
                console.log(lowerCase(middle), middleId, last);
                await this.client[lowerCase(middle)].update({
                    where: { id: middleId },
                    data: {
                        [last]: {
                            connect: ids.map((v) => ({
                                id: typeof v.id === 'string' ? parseInt(v.id) : v.id,
                            }))
                        }
                    }
                });
            }
        }
        else {
            await this.update(record.params.id, {
                [resourceId]: ids.map((value) => ({ id: value.id })),
            });
        }
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
            p.reference();
            return p.type() === 'reference';
        })
            .map((p) => p);
    }
}
//# sourceMappingURL=customResource.js.map