import { BaseRecord } from "adminjs";
class CustomRecord extends BaseRecord {
    id() {
        const idProperties = this.resource.properties().filter((p) => p.isId());
        if (!idProperties.length) {
            throw new Error(`Resource: "${this.resource.id()}" does not have an id property`);
        }
        return this.params[idProperties[0].name()];
    }
}
export default CustomRecord;
//# sourceMappingURL=customRecord.js.map