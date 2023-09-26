import { BaseProperty } from 'adminjs';
import type { DMMF } from '@prisma/client/runtime/library.js';
export declare class Property extends BaseProperty {
    column: any;
    enums: any;
    columnPosition: any;
    depModel: string;
    depModelObject: DMMF.Model;
    constructor(column: any, columnPosition: number, enums: any);
    isEditable(): boolean;
    isId(): boolean;
    name(): any;
    isRequired(): any;
    isSortable(): boolean;
    reference(): any;
    referencedColumnName(): any;
    foreignColumnName(): any;
    availableValues(): any;
    position(): any;
    isEnum(): boolean;
    type(): any;
}
