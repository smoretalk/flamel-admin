import {Filter, flat } from "adminjs";
import type { DMMF } from '@prisma/client/runtime/library.js';
import {Property} from "./customProperty.js";
import {convertParam} from "./convertParam.js";

export const safeParseJSON = (json: string) => {
  try {
    return JSON.parse(json);
  }
  catch (e) {
    return null;
  }
};

export const convertFilter = (modelFields: DMMF.Model['fields'], filterObject: Filter): Record<string, any> => {
  if (!filterObject) return {};

  const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  const { filters = {} } = filterObject;
  return Object.entries(filters).reduce((where: Record<string, any>, [name, filter]) => {
    if (['boolean', 'number', 'float', 'object', 'array'].includes(filter.property.type())) {
      if (filter.property.type() === 'number') {
        const regex = (filter.value as string).match(/([<>]=?)\s*(\d+)/);
        if (regex?.[1] === '<') {
          where[name] = {
            lt: parseInt(regex[2]),
          }
        } else if (regex?.[1] === '>') {
          where[name] = {
            gt: parseInt(regex[2]),
          }
        } else if (regex?.[1] === '<=') {
          where[name] = {
            lte: parseInt(regex[2]),
          }
        } else if (regex?.[1] === '>=') {
          where[name] = {
            gte: parseInt(regex[2]),
          }
        } else {
          where[name] = safeParseJSON(filter.value as string);
        }
      } else {
        where[name] = safeParseJSON(filter.value as string);
      }
    } else if (['date', 'datetime'].includes(filter.property.type())) {
      if (typeof filter.value !== 'string' && filter.value.from && filter.value.to) {
        where[name] = { gte: new Date(filter.value.from), lte: new Date(filter.value.to) };
      } else if (typeof filter.value !== 'string' && filter.value.from) {
        where[name] = { gte: new Date(filter.value.from) };
      } else if (typeof filter.value !== 'string' && filter.value.to) {
        where[name] = { lte: new Date(filter.value.to) };
      }
    } else if ((filter.property as Property).isEnum()) {
      where[name] = { equals: filter.value };
    } else if (filter.property.type() === 'string' && uuidRegex.test(filter.value.toString())) {
      where[name] = { equals: filter.value };
    } else if (filter.property.type() === 'reference' && (filter.property as Property).foreignColumnName()) {
      where[(filter.property as Property).foreignColumnName() as string] = convertParam(
        filter.property as Property,
        modelFields,
        filter.value,
      );
    } else if (filter.value === 'null') {
      where[name] = { equals: null };
    } else if (filter.value === '!null') {
      where[name] = { not: null }
    } else if (filter.value.toString().startsWith('-')) {
      where[name] = { not: filter.value.toString().slice(1) }
    } else {
      where[name] = { contains: filter.value.toString() };
    }

    return flat.unflatten(where, { overwrite: true });
  }, {});
};
