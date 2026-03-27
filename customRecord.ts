import {BaseRecord, flat, ParamsType} from "adminjs";
import {CustomResource} from "./customResource.js";

/**
 * Representation of an particular ORM/ODM Record in given Resource in AdminJS
 *
 * @category Base
 */
class CustomRecord extends BaseRecord {
  declare resource: CustomResource;
  constructor(params: ParamsType, resource: CustomResource) {
    super(params, resource);
    this.params = params ? flat.flatten(params, { safe: true }) : {};
    this.resource = resource
  }

  /**
   * Returns uniq id of the Record.
   * @return {string | number} id of the Record
   */
  override id(): string {
    const idProperties = this.resource.properties().filter((p) => p.isId())
    if (!idProperties.length) {
      throw new Error(`Resource: "${this.resource.id()}" does not have an id property`)
    }
    // idProperty가 여러 개일 수 있는 문제 해결
    const idField = this.resource.model.fields.find((v) => v.isId);
    const idProperty = idProperties.find((v) => v.name() === idField.name);
    const value = this.params[idProperty.name()];
    if (typeof value === 'object' && value !== null) {
      return (value as Record<string, any>)[idProperty.name()];
    }
    return value;
  }
}

export default CustomRecord
