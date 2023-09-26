import {safeParseNumber} from "@adminjs/prisma/lib/utils/helpers.js";
import {Property} from "./customProperty.js";

export const convertParam = (property: Property, fields, value, nested = false) => {
  const type = property.type();
  if (type === 'mixed')
    return value;
  if (type === 'number') {
    return safeParseNumber(value);
  }
  if (type === 'boolean') {
    return value === true || value === 'true'
  }
  if (type === 'reference') {
    const foreignColumn = fields.find((field) => field.name === property.foreignColumnName());
    if (!foreignColumn)
      return value;
    if (value === undefined || value === null)
      return value;
    const foreignColumnType = foreignColumn.type;
    if (nested) { // 중첩된 모델인 경우
      if (value === undefined || value === null)
        return { disconnect: true };
      if (foreignColumnType === 'String')
        return { connect: { id: String(value) } };
      return { connect: { id: safeParseNumber(value) } };
    }
    if (foreignColumnType === 'String')
      return String(value);
    return safeParseNumber(value);
  }
  return value;
};
