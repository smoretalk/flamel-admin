export const isNumeric = (value) => {
  const stringValue = String(value).replace(/,/g, ".");
  if (isNaN(parseFloat(stringValue))) return false;
  return isFinite(Number(stringValue));
};
export const safeParseNumber = (value) => {
  if (isNumeric(value)) return Number(value);
  return value;
};
export const convertParam = (property, fields, value, nested = false) => {
  const type = property.type();
  if (type === "mixed") return value;
  if (
    type === "number" &&
    (typeof value === "string" || typeof value === "number")
  ) {
    return safeParseNumber(value);
  }
  if (type === "boolean") {
    return value === true || value === "true";
  }
  if (type === "reference") {
    const foreignColumn = fields.find(
      (field) => field.name === property.foreignColumnName()
    );
    if (!foreignColumn) {
      return undefined;
    }
    if (value === undefined || value === null) return value;
    const foreignColumnType = foreignColumn.type;
    if (nested) {
      if (value === undefined || value === null) return { disconnect: true };
      if (foreignColumnType === "String")
        return { connect: { id: String(value) } };
      if (typeof value === "string" || typeof value === "number") {
        return { connect: { id: safeParseNumber(value) } };
      }
    }
    if (foreignColumnType === "String") return String(value);
    if (typeof value === "string" || typeof value === "number") {
      return safeParseNumber(value);
    }
  }
  return value;
};
//# sourceMappingURL=convertParam.js.map
