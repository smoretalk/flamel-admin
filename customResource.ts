import {BaseRecord, BaseResource, Filter, flat, FlattenParams, ParamsType} from 'adminjs';
import { convertFilter, type Enums, getEnums } from "@adminjs/prisma";
import type { DMMF } from '@prisma/client/runtime/library.js';
import { type PrismaClient } from '@prisma/client';
import { Property } from "./customProperty.js";
import { convertParam } from "./convertParam.js";

export const lowerCase = (name: string) => name.substring(0, 1).toLowerCase() + name.substring(1);

type Args = { model: DMMF.Model, client: any, clientModule?: { Prisma: { dmmf: DMMF.Document } }, include?: object, depModels?: DMMF.Model[]};
export class CustomResource extends BaseResource {
  model: DMMF.Model;
  client: any;
  enums: Enums;
  manager;
  propertiesObject: { [key: string]: Property };
  include;
  depModels;
  depModelsObject;
  constructor(args: Args) {
    super(args);
    const { model, client, clientModule, include, depModels } = args;
    this.model = model;
    this.client = client;
    this.enums = getEnums(clientModule);
    this.manager = this.client[lowerCase(model.name)];
    this.propertiesObject = this.prepareProperties();
    this.include = include || {};
    this.depModels = depModels || [];
    this.depModelsObject = depModels?.map((model) => this.prepareDepModelProperties(model));
    this.depModelsObject?.forEach((depModels) => {
      this.propertiesObject = {
        ...depModels,
        ...this.propertiesObject,
      }
    });
  }
  override databaseName() {
    return 'prisma';
  }
  override databaseType(): string {
    return (this.client as any)._engineConfig?.activeProvider ?? 'database';
  }
  override id() {
    return this.model.name;
  }
  override properties(): Property[] {
    return [...Object.values(this.propertiesObject)];
  }
  override property(path: string) {
    return this.propertiesObject[path] ?? null;
  }
  override build(params: object): BaseRecord {
    return new BaseRecord(flat.unflatten(params), this);
  }
  override async count(filter: Filter) {
    return this.manager.count({ where: convertFilter(this.model.fields, filter) });
  }
  override async find(filter: Filter, params: { limit?: number, offset?: number, sort?: { direction?: string, sortBy?: string } } = {}): Promise<BaseRecord[]> {
    console.log('find called', this.include);
    const { limit = 10, offset = 0, sort = {} } = params;
    const { direction, sortBy } = sort;
    const where = convertFilter(this.model.fields, filter);
    console.log('where', where);
    const results: FlattenParams[] = await this.manager.findMany({
      where,
      skip: offset,
      take: limit,
      include: this.include,
      orderBy: {
        [sortBy]: direction,
      },
    });
    return results.map((result) => new BaseRecord(this.prepareReturnValues(result), this));
  }
  override async findOne(id: string): Promise<BaseRecord> {
    console.log('findOne called');
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty)
      return null;
    const result = await this.manager.findUnique({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
      },
      include: this.include,
    });
    if (!result)
      return null;
    return new BaseRecord(this.prepareReturnValues(result), this);
  }
  override async findMany(ids: string[]): Promise<BaseRecord[]> {
    console.log('findMany called');
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty)
      return [];
    const results: FlattenParams[] = await this.manager.findMany({
      where: {
        [idProperty.path()]: {
          in: ids.map((id) => convertParam(idProperty, this.model.fields, id)),
        },
      },
      include: this.include,
    });
    return results.map((result) => new BaseRecord(this.prepareReturnValues(result), this));
  }
  override async create(params: FlattenParams) {
    const preparedParams = this.prepareParams(params);
    const result = await this.manager.create({ data: preparedParams });
    return this.prepareReturnValues(result);
  }
  override async update(pk: unknown, params = {}) {
    console.log('update');
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty)
      return {};
    const preparedParams = this.prepareParams(params);
    console.log('preparedParams', preparedParams, idProperty.path(), convertParam(idProperty, this.model.fields, pk));
    const result = await this.manager.update({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, pk),
      },
      data: preparedParams,
    });
    console.log('udpate result', result);
    return this.prepareReturnValues(result);
  }
  override async delete(id: string) {
    const idProperty = this.properties().find((property) => property.isId());
    if (!idProperty)
      return;
    await this.manager.delete({
      where: {
        [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
      },
    });
  }
  static override isAdapterFor(args: Args) {
    const { model, client } = args;
    return !!model?.name && !!model?.fields.length && !!client?.[lowerCase(model.name)];
  }

  prepareProperties() {
    const { fields = [] } = this.model;
    return fields.reduce((memo: { [k: string]: Property }, field) => {
      if (field.isReadOnly && !field.isId) {
        return memo;
      }
      const property = new Property(field, Object.keys(memo).length, this.enums);
      memo[property.path()] = property;
      return memo;
    }, {});
  }
  prepareDepModelProperties(model: DMMF.Model) {
    const { fields = [], name } = model;
    return fields.reduce((memo: { [k: string]: Property }, field) => {
      if (field.isReadOnly && !field.isId) {
        return memo;
      }
      const property = new Property(field, Object.keys(memo).length, this.enums);
      property.depModel = name;
      property.depModelObject = model;
      memo[`${name}.${property.path()}`] = property;
      return memo;
    }, {});
  }
  prepareParams(params: FlattenParams) {
    console.log('prepareParams', params);
    const preparedParams: { [k: string]: unknown } = {};
    for (const property of this.properties()) {
      const param: object[] = flat.get(params, property.path());
      const key = property.path();

      // eslint-disable-next-line no-continue
      if (param === undefined)
        continue;
      const type = property.type();
      const foreignColumnName = property.foreignColumnName();
      if (type === 'reference' && foreignColumnName) {
        preparedParams[foreignColumnName] = convertParam(property, this.model.fields, param);
        // eslint-disable-next-line no-continue
        continue;
      }
      if (type === 'reference' && typeof param === 'object' && !Array.isArray(param)) {
        // 중첩된 객체는 after에서 따로 처리
        continue;
      }
      if (property.isArray()) {
        preparedParams[key] = param ? param.map((p) => convertParam(property, this.model.fields, p)) : param;
      } else {
        preparedParams[key] = convertParam(property, this.model.fields, param);
      }
    }
    return preparedParams;
  }

  isNonArrayObject(target: object) {
    return typeof target === 'object' && !Array.isArray(target);
  }

  prepareReturnValues(params: FlattenParams) {
    const preparedValues: { [k: string]: unknown } = {};
    console.log('params', params);
    for (const property of this.properties()) {
      const param = flat.get(params, property.path());

      const key = property.path();
      if (property.depModel && params?.[property.depModel]) {
        if (!param) {
          // 중첩된 릴레이션의 값(ex: 'CollectionInfo.CollectionKoTags' = [...])
          preparedValues[`${property.depModel}.${key}`] = (params?.[property.depModel] as Record<string, object>)[key];
          if (property.type() === 'reference' && property.depModelObject.fields && this.isNonArrayObject((params?.[property.depModel] as Record<string, object>)[key])) {
            // 중첩된 릴레이션이 reference고 id가 있는 객체면 객체를 아이디로 교체
            const foreignKey = property.foreignColumnName();
            preparedValues[`${property.depModel}.${key}`] = (params?.[property.depModel] as Record<string, Record<string, object>>)[key]?.[foreignKey];
          }
          continue;
        }
        if (param) {
          preparedValues[`${property.depModel}.${key}`] = params[key];
          continue;
        }
      }
      if (param !== undefined && property.type() !== 'reference') {
        preparedValues[key] = param;
        // eslint-disable-next-line no-continue
        continue;
      }
      if (Array.isArray(param) ) {
        // 다대다 관계
        preparedValues[key] = param;
      }
      const foreignColumnName = property.foreignColumnName();
      // eslint-disable-next-line no-continue
      if (!foreignColumnName)
        continue;
      preparedValues[key] = params[foreignColumnName];
    }
    console.log('preparedValues', preparedValues);
    return preparedValues;
  }

  titleField() {
    return this.decorate().titleProperty().name();
  }

  wrapObjects(objects: { toJSON(): ParamsType }[]) {
    return objects.map(
      (sequelizeObject) => new BaseRecord(sequelizeObject.toJSON(), this),
    );
  }
  // 일대다용도
  async saveRecord(where: object, resourceId: string, ids: { imageId: number }) {
    const update = ids;
    const create = {
      ...ids,
    };
    if (resourceId === 'GenerationInfo' || resourceId === 'CollectionInfo' || resourceId === 'UpscaleInfo') {
      delete create.imageId;
      delete update.imageId;
    }
    await this.manager.update({
      where,
      data: {
        [resourceId]: {
          upsert: {
            create,
            update,
          }
        }
      }
    })
  }

  // 다대다용도
  async saveRecords(key: string, idValue: string, resourceId: string, targetKey: string, ids: { id: string | number }[]) {
    console.log('record', key, idValue, 'resourceId', resourceId, targetKey, 'ids', ids);
    if (resourceId.includes('.')) { // 중첩된 다대다관계이면
      // 중첩된 리소스로 타고 들어가서 다대다 수행
      const split = resourceId.split('.');
      const middle = split[0];
      const last = split[1];
      const result = await this.manager.findFirst({
        where: {
          [key]: idValue,
        },
        include: {
          [middle]: true,
        }
      });
      if (result?.[middle]) {
        console.log('insert nested m2m', middle, last);
        const middleId = result[middle][key]; // TODO: 다른 아이디도 가능하게 만들기
        console.log(lowerCase(middle), middleId, last);
        await (this.client[lowerCase(middle)] as any).update({
          where: { [key]: middleId},
          data: {
            [last]: {
              set: ids.map((v) => {
                const value = v.id || v[targetKey as 'id'];
                console.log('value', value, 'targetKey', targetKey, 'v', v);
                return ({
                  [targetKey]: typeof value === 'string' ? parseInt(value) : value,
                })
              })
            }
          }
        })
      }
    } else {
      console.log('insert m2m', key, idValue, resourceId);
      await this.manager.update({
        where: { [key]: idValue },
        data: {
          [resourceId]: {
            set: ids.map((v) => {
              const value = v.id || v[targetKey as 'id'];
              return ({[targetKey]: typeof value === 'string' ? parseInt(value) : value})
            })
          }
        }
      });
    }
  }

  primaryKeyField() {
    return this.id;
  }

  getManyReferences(): BaseResource[] {
    return this.decorate()
      .getProperties({where: 'edit'})
      .filter((p) => {
        return p.type() === 'reference';
      })
      .map((p) => p.reference());
  }

  getManyProperties() {
    return this.decorate()
      .getProperties({where: 'edit'})
      .filter((p) => {
        p.reference();
        return p.type() === 'reference';
      })
      .map((p) => p);
  }
}
