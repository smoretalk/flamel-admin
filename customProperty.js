import { BaseProperty } from 'adminjs';
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
    column;
    enums;
    columnPosition;
    depModel;
    depModelObject;
    constructor(column, columnPosition = 0, enums) {
        const path = column.name;
        super({ path });
        this.column = column;
        this.enums = enums;
        this.columnPosition = columnPosition;
    }
    isEditable() {
        return !this.isId() && this.column.name !== 'createdAt' && this.column.name !== 'updatedAt';
    }
    isId() {
        return !!this.column.isId;
    }
    name() {
        return this.column.name;
    }
    isRequired() {
        return this.column.isRequired;
    }
    isSortable() {
        return this.type() !== 'reference';
    }
    reference() {
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
    availableValues() {
        if (!this.isEnum())
            return null;
        const enumSchema = this.enums[this.column.type];
        if (!enumSchema)
            return null;
        return enumSchema.values.map((value) => String(value.name)) ?? [];
    }
    position() {
        return this.columnPosition || 0;
    }
    isEnum() {
        return this.column.kind === 'enum';
    }
    type() {
        let type = DATA_TYPES[this.column.type];
        if (this.reference()) {
            type = 'reference';
        }
        if (this.isEnum()) {
            type = 'string';
        }
        if (!type) {
            console.warn(`Unhandled type: ${this.column.type}`);
        }
        return type;
    }
}
//# sourceMappingURL=customProperty.js.map