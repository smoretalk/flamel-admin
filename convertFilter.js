import { flat } from "adminjs";
import { convertParam } from "./convertParam.js";
export const safeParseJSON = (json) => {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return null;
    }
};
export const convertFilter = (modelFields, filterObject) => {
    if (!filterObject)
        return {};
    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const { filters = {} } = filterObject;
    return Object.entries(filters).reduce((where, [name, filter]) => {
        if (['boolean', 'number', 'float', 'object', 'array'].includes(filter.property.type())) {
            where[name] = safeParseJSON(filter.value);
        }
        else if (['date', 'datetime'].includes(filter.property.type())) {
            if (typeof filter.value !== 'string' && filter.value.from && filter.value.to) {
                where[name] = { gte: new Date(filter.value.from), lte: new Date(filter.value.to) };
            }
            else if (typeof filter.value !== 'string' && filter.value.from) {
                where[name] = { gte: new Date(filter.value.from) };
            }
            else if (typeof filter.value !== 'string' && filter.value.to) {
                where[name] = { lte: new Date(filter.value.to) };
            }
        }
        else if (filter.property.isEnum()) {
            where[name] = { equals: filter.value };
        }
        else if (filter.property.type() === 'string' && uuidRegex.test(filter.value.toString())) {
            where[name] = { equals: filter.value };
        }
        else if (filter.property.type() === 'reference' && filter.property.foreignColumnName()) {
            where[filter.property.foreignColumnName()] = convertParam(filter.property, modelFields, filter.value);
        }
        else if (filter.value === '!null') {
            where[name] = { not: null };
        }
        else {
            where[name] = { contains: filter.value.toString() };
        }
        return flat.unflatten(where, { overwrite: true });
    }, {});
};
//# sourceMappingURL=convertFilter.js.map