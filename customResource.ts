import { Resource } from '@adminjs/prisma';
import {BaseRecord, BaseResource} from 'adminjs';

export class CustomResource extends Resource {
  titleField() {
    return this.decorate().titleProperty().name();
  }

  wrapObjects(objects) {
    return objects.map(
      (sequelizeObject) => new BaseRecord(sequelizeObject.toJSON(), this),
    );
  }

  // async getRoles(record) {
  //   const result = await this.findOne(record.params.id);
  //   console.log(
  //     '🚀 ~ file: admin.resource.ts:22 ~ CustomResource ~ getRoles ~ result',
  //     result,
  //   );
  // }

  async findRelated(record, resource: CustomResource, options = {}) {
    // resource.find(
    //   {
    //     relations: true,
    //   },
    //   {},
    // );
    // const instance = this.getInstance(record);
    // const association = this.getAssociationsByResourceId(resource)[0];
    // return await instance[association.accessors.get](options);
  }

  // getAssociationsByResourceId(resourceId) {
  //   return Object.values(this.SequelizeModel.associations).filter(
  //     (association) => association.target.name === resourceId,
  //   );
  // }

  // getInstance(record) {
  //   return new this.SequelizeModel(record.params, { isNewRecord: false });
  // }

  // 일대다용도
  async saveRecord(record, resourceId, ids) {
    await this.manager.update({
      where: { id: record.params.id },
      data: {
        [resourceId]: {
          upsert: {
            create: ids,
            update: ids,
          }
        }
      }
    })
  }

  // 다대다용도
  async saveRecords(record, resourceId, ids: { id: string | number }[]) {
    console.log('record', record.params.id, 'resourceId', resourceId, 'ids', ids);
    if (resourceId.includes('.')) { // 중첩된 다대다관계이면
      // 중첩된 리소스로 타고 들어가서 다대다 수행
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
        })
      }
    } else {
      await this.update(record.params.id, {
        [resourceId]: ids.map((value) => ({ id: value.id })),
      });
    }
  }

  primaryKeyField() {
    return this.id;
  }

  getManyReferences(): BaseResource[] {
    return this.decorate()
      .getProperties({ where: 'edit' })
      .filter((p: any) => {
        return p.type() === 'reference';
      })
      .map((p) => p.reference());
  }

  getManyProperties() {
    return this.decorate()
      .getProperties({ where: 'edit' })
      .filter((p: any) => {
        return p.type() === 'reference';
      })
      .map((p) => p);
  }
}
