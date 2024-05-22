import { BaseRecord, ParamsType } from "adminjs";
import { CustomResource } from "./customResource.js";
declare class CustomRecord extends BaseRecord {
    resource: CustomResource;
    constructor(params: ParamsType, resource: CustomResource);
    id(): string;
}
export default CustomRecord;
