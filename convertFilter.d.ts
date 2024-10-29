import { Filter } from "adminjs";
import type { DMMF } from '@prisma/client/runtime/library.js';
export declare const safeParseJSON: (json: string) => any;
export declare const convertFilter: (modelFields: DMMF.Model["fields"], filterObject: Filter) => Record<string, any>;
