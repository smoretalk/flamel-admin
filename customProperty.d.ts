import { BaseProperty, PropertyType } from 'adminjs';
import type { DMMF } from '@prisma/client/runtime/library.js';
export declare class Property extends BaseProperty {
    column: DMMF.Field;
    enums: {
        [k: string]: {
            values: {
                name: string;
            }[];
        };
    };
    columnPosition: number;
    depModel: string;
    depModelObject: DMMF.Model;
    constructor(column: DMMF.Field, columnPosition: number, enums: {
        [k: string]: {
            values: {
                name: string;
            }[];
        };
    });
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
