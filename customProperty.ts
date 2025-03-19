import {BaseProperty, PropertyType} from 'adminjs';
import { DMMF } from '@prisma/client/runtime/library.js';
import {Enums} from "@adminjs/prisma";

const DATA_TYPES = {
  String: 'string',
  Boolean: 'boolean',
  Int: 'number',
  BigInt: 'number',
  Float: 'number',
  Decimal: 'number',
  DateTime: 'datetime',
  Json: 'mixed',
};

export class Property extends BaseProperty {
  column: DMMF.Field;
  enums;
  columnPosition;
  depModel: string;
  depModelAlias: string;
  depModelObject: DMMF.Model;
  // eslint-disable-next-line default-param-last
  constructor(column: DMMF.Field, columnPosition = 0, enums: Enums) {
    const path = column.name;
    super({ path });
    this.column = column;
    this.enums = enums;
    this.columnPosition = columnPosition;
  }
  override isEditable() {
    return !this.isId() && this.column.name !== 'createdAt' && this.column.name !== 'updatedAt';
  }
  override isId() {
    return !!this.column.isId;
  }
  override name() {
    return this.column.name;
  }
  override isRequired() {
    return this.column.isRequired;
  }
  override isArray() {
    return this.column.isList;
  }
  override isSortable() {
    return this.type() !== 'reference';
  }
  override reference() {
    const isRef = this.column.kind !== 'scalar' && !!this.column.relationName;
    if (isRef) {
      return this.column.type;
    }
    return null;
  }
  referencedColumnName() {
    if (!this.reference())
      return null;
    return this.column.relationToFields?.[0] ?? null;
  }
  foreignColumnName() {
    if (!this.reference())
      return null;
    return this.column.relationFromFields?.[0] ?? null;
  }
  override availableValues() {
    if (!this.isEnum())
      return null;
    const enumSchema = this.enums[this.column.type];
    if (!enumSchema)
      return null;
    return enumSchema.values.map((value) => String(value.name)) ?? [];
  }
  override position() {
    return this.columnPosition || 0;
  }
  isEnum() {
    return this.column.kind === 'enum';
  }
  override type() {
    let type = DATA_TYPES[this.column.type as keyof typeof DATA_TYPES] as PropertyType;
    if (this.reference()) {
      type = 'reference';
    }
    if (this.isEnum()) {
      type = 'string';
    }
    // eslint-disable-next-line no-console
    if (!type) {
      console.warn(`Unhandled type: ${this.column.type}`);
    }
    return type;
  }
}
//# sour
