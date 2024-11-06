import { Filter } from "adminjs";
import { DMMF } from '@prisma/client/runtime/library.js';
export declare const safeParseJSON: (json: string) => any;
export declare const convertFilter: (modelFields: DMMF.Model, filterObject: Filter) => Record<string, any>;
