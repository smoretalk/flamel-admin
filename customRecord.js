import { BaseRecord } from "adminjs";
class CustomRecord extends BaseRecord {
    constructor(params, resource) {
        super(params, resource);
        this.resource = resource;
    }
    id() {
        const idProperties = this.resource.properties().filter((p) => p.isId());
        if (!idProperties.length) {
            throw new Error(`Resource: "${this.resource.id()}" does not have an id property`);
        }
        const idField = this.resource.model.fields.find((v) => v.isId);
        const idProperty = idProperties.find((v) => v.name() === idField.name);
        return this.params[idProperty.name()];
    }
}
export default CustomRecord;
//# sourceMappingURL=customRecord.js.map