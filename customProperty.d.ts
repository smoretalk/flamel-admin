import { BaseProperty, PropertyType } from 'adminjs';
import type { DMMF } from '@prisma/client/runtime/library.js';
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
    isSortable(): boolean;
    reference(): string;
    referencedColumnName(): any;
    foreignColumnName(): string;
    availableValues(): string[];
    position(): number;
    isEnum(): boolean;
    type(): PropertyType;
}
