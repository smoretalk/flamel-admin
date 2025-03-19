import { BaseProperty, PropertyType } from 'adminjs';
import { DMMF } from '@prisma/client/runtime/library.js';
import { Enums } from "@adminjs/prisma";
export declare class Property extends BaseProperty {
    column: DMMF.Field;
    enums: Enums;
    columnPosition: number;
    depModel: string;
    depModelAlias: string;
    depModelObject: DMMF.Model;
    constructor(column: DMMF.Field, columnPosition: number, enums: Enums);
    isEditable(): boolean;
    isId(): boolean;
    name(): string;
    isRequired(): boolean;
    isArray(): boolean;
    isSortable(): boolean;
    reference(): string;
    referencedColumnName(): string;
    foreignColumnName(): string;
    availableValues(): string[];
    position(): number;
    isEnum(): boolean;
    type(): PropertyType;
}
