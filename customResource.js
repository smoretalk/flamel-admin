import { BaseRecord, BaseResource, flat } from 'adminjs';
import { convertFilter, getEnums } from "@adminjs/prisma";
import { Property } from "./customProperty.js";
import { convertParam } from "./convertParam.js";
export const lowerCase = (name) => name.substring(0, 1).toLowerCase() + name.substring(1);
export class CustomResource extends BaseResource {
    model;
    client;
    enums;
    manager;
    propertiesObject;
    include;
    depModels;
    depModelsObject;
    constructor(args) {
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
            };
        });
    }
    databaseName() {
        return 'prisma';
    }
    databaseType() {
        return this.client._engineConfig?.activeProvider ?? 'database';
    }
    id() {
        return this.model.name;
    }
    properties() {
        return [...Object.values(this.propertiesObject)];
    }
    property(path) {
        return this.propertiesObject[path] ?? null;
    }
    build(params) {
        return new BaseRecord(flat.unflatten(params), this);
    }
    async count(filter) {
        return this.manager.count({ where: convertFilter(this.model.fields, filter) });
    }
    async find(filter, params = {}) {
        console.log('find called', this.include);
        const { limit = 10, offset = 0, sort = {} } = params;
        const { direction, sortBy } = sort;
        const where = convertFilter(this.model.fields, filter);
        console.log('where', where);
        const results = await this.manager.findMany({
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
    async findOne(id) {
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
    async findMany(ids) {
        console.log('findMany called');
        const idProperty = this.properties().find((property) => property.isId());
        if (!idProperty)
            return [];
        const results = await this.manager.findMany({
            where: {
                [idProperty.path()]: {
                    in: ids.map((id) => convertParam(idProperty, this.model.fields, id)),
                },
            },
            include: this.include,
        });
        return results.map((result) => new BaseRecord(this.prepareReturnValues(result), this));
    }
    async create(params) {
        const preparedParams = this.prepareParams(params);
        const result = await this.manager.create({ data: preparedParams });
        return this.prepareReturnValues(result);
    }
    async update(pk, params = {}) {
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
    async delete(id) {
        const idProperty = this.properties().find((property) => property.isId());
        if (!idProperty)
            return;
        await this.manager.delete({
            where: {
                [idProperty.path()]: convertParam(idProperty, this.model.fields, id),
            },
        });
    }
    static isAdapterFor(args) {
        const { model, client } = args;
        return !!model?.name && !!model?.fields.length && !!client?.[lowerCase(model.name)];
    }
    prepareProperties() {
        const { fields = [] } = this.model;
        return fields.reduce((memo, field) => {
            if (field.isReadOnly && !field.isId) {
                return memo;
            }
            const property = new Property(field, Object.keys(memo).length, this.enums);
            memo[property.path()] = property;
            return memo;
        }, {});
    }
    prepareDepModelProperties(model) {
        const { fields = [], name } = model;
        return fields.reduce((memo, field) => {
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
    prepareParams(params) {
        console.log('prepareParams', params);
        const preparedParams = {};
        for (const property of this.properties()) {
            const param = flat.get(params, property.path());
            const key = property.path();
            if (param === undefined)
                continue;
            const type = property.type();
            const foreignColumnName = property.foreignColumnName();
            if (type === 'reference' && foreignColumnName) {
                preparedParams[foreignColumnName] = convertParam(property, this.model.fields, param);
                continue;
            }
            if (type === 'reference' && typeof param === 'object' && !Array.isArray(param)) {
                continue;
            }
            if (property.isArray()) {
                preparedParams[key] = param ? param.map((p) => convertParam(property, this.model.fields, p)) : param;
            }
            else {
                preparedParams[key] = convertParam(property, this.model.fields, param);
            }
        }
        return preparedParams;
    }
    isNonArrayObject(target) {
        return typeof target === 'object' && !Array.isArray(target);
    }
    prepareReturnValues(params) {
        const preparedValues = {};
        console.log('params', params);
        for (const property of this.properties()) {
            const param = flat.get(params, property.path());
            const key = property.path();
            if (property.depModel && params?.[property.depModel]) {
                if (!param) {
                    preparedValues[`${property.depModel}.${key}`] = params?.[property.depModel][key];
                    if (property.type() === 'reference' && property.depModelObject.fields && this.isNonArrayObject(params?.[property.depModel][key])) {
                        const foreignKey = property.foreignColumnName();
                        preparedValues[`${property.depModel}.${key}`] = params?.[property.depModel][key]?.[foreignKey];
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
                continue;
            }
            if (Array.isArray(param)) {
                preparedValues[key] = param;
            }
            const foreignColumnName = property.foreignColumnName();
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
    wrapObjects(objects) {
        return objects.map((sequelizeObject) => new BaseRecord(sequelizeObject.toJSON(), this));
    }
    async findRelated(record, resource, options = {}) {
    }
    async saveRecord(where, resourceId, ids) {
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
        });
    }
    async saveRecords(key, idValue, resourceId, targetKey, ids) {
        console.log('record', key, idValue, 'resourceId', resourceId, targetKey, 'ids', ids);
        if (resourceId.includes('.')) {
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
                const lowerCase = (name) => name.substring(0, 1).toLowerCase() + name.substring(1);
                const middleId = result[middle][key];
                console.log(lowerCase(middle), middleId, last);
                await this.client[lowerCase(middle)].update({
                    where: { [key]: middleId },
                    data: {
                        [last]: {
                            set: ids.map((v) => {
                                const value = v.id || v[targetKey];
                                console.log('value', value, 'targetKey', targetKey, 'v', v);
                                return ({
                                    [targetKey]: typeof value === 'string' ? parseInt(value) : value,
                                });
                            })
                        }
                    }
                });
            }
        }
        else {
            console.log('insert m2m', key, idValue, resourceId);
            await this.manager.update({
                where: { [key]: idValue },
                data: {
                    [resourceId]: {
                        set: ids.map((v) => {
                            const value = v.id || v[targetKey];
                            return ({ [targetKey]: typeof value === 'string' ? parseInt(value) : value });
                        })
                    }
                }
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