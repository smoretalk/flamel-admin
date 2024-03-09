import {BaseRecord} from "adminjs";

/**
 * Representation of an particular ORM/ODM Record in given Resource in AdminJS
 *
 * @category Base
 */
class CustomRecord extends BaseRecord {
  /**
   * Returns uniq id of the Record.
   * @return {string | number} id of the Record
   */
  override id(): string {
    const idProperties = this.resource.properties().filter((p) => p.isId())
    if (!idProperties.length) {
      throw new Error(`Resource: "${this.resource.id()}" does not have an id property`)
    }
    return this.params[idProperties[0].name()]
  }
}

export default CustomRecord
