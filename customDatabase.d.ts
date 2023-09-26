import { BaseDatabase } from 'adminjs';
export declare class Database extends BaseDatabase {
    client: any;
    clientModule: any;
    rest: any[];
    constructor(args: any);
    resources(): any;
    static isAdapterFor(args: any): boolean;
}
