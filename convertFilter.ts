import {Filter} from "adminjs";
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
    console.log('convertFilter.js', name, filters, filter);
    if (name.includes('.')) { // 중첩된 filter
      const names = name.split('.');
      where[names[0]] = {
        [names[1]]: null,
      }
      if (['boolean', 'number', 'float', 'object', 'array'].includes(filter.property.type())) {
        where[names[0]][names[1]] = safeParseJSON(filter.value as string);
      } else if (['date', 'datetime'].includes(filter.property.type())) {
        if (typeof filter.value !== 'string' && filter.value.from && filter.value.to) {
          where[names[0]][names[1]] = { gte: new Date(filter.value.from), lte: new Date(filter.value.to) };
        } else if (typeof filter.value !== 'string' && filter.value.from) {
          where[names[0]][names[1]] = { gte: new Date(filter.value.from) };
        } else if (typeof filter.value !== 'string' && filter.value.to) {
          where[names[0]][names[1]] = { lte: new Date(filter.value.to) };
        }
      } else if ((filter.property as Property).isEnum()) {
        where[names[0]][names[1]] = { equals: filter.value };
      } else if (filter.property.type() === 'string' && uuidRegex.test(filter.value.toString())) {
        where[names[0]][names[1]] = { equals: filter.value };
      } else if (filter.property.type() === 'reference' && (filter.property as Property).foreignColumnName()) {
        where[(filter.property as Property).foreignColumnName() as string] = convertParam(
          filter.property as Property,
          modelFields,
          filter.value,
        );
      } else {
        where[names[0]][names[1]] = { contains: filter.value.toString() };
      }
      return where;
    }
    if (['boolean', 'number', 'float', 'object', 'array'].includes(filter.property.type())) {
      where[name] = safeParseJSON(filter.value as string);
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
    } else {
      where[name] = { contains: filter.value.toString() };
    }

    return where;
  }, {});
};
