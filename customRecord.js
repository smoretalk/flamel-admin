import { BaseRecord, flat } from "adminjs";
class CustomRecord extends BaseRecord {
    constructor(params, resource) {
        super(params, resource);
        this.params = params ? flat.flatten(params, { safe: true }) : {};
        this.resource = resource;
    }
    id() {
        const idProperties = this.resource.properties().filter((p) => p.isId());
        if (!idProperties.length) {
            throw new Error(`Resource: "${this.resource.id()}" does not have an id property`);
        }
        const idField = this.resource.model.fields.find((v) => v.isId);
        const idProperty = idProperties.find((v) => v.name() === idField.name);
        const value = this.params[idProperty.name()];
        if (typeof value === 'object' && value !== null) {
            return value[idProperty.name()];
        }
        return value;
    }
}
export default CustomRecord;
//# sourceMappingURL=customRecord.js.map