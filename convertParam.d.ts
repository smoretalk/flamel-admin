import { Property } from "./customProperty.js";
export declare const isNumeric: (value: string | number) => value is string;
export declare const safeParseNumber: (value: string | number) => number;
export declare const convertParam: (property: Property, fields: {
    name: string;
    type: string;
}[], value: unknown, nested?: boolean) => unknown;
