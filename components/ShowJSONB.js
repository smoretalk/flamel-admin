import React from 'react';
import _ from 'lodash';
import { unflatten } from 'flat';
import { Badge, Section, FormGroup, Label } from '@adminjs/design-system';
import { flat } from "adminjs";
const mapBoolean = (value) => {
    if (typeof value === 'undefined') {
        return '';
    }
    return value ? 'Yes' : 'No';
};
class JSONBEntry extends React.PureComponent {
    render() {
        const { paramObject } = this.props;
        if (typeof paramObject === 'boolean') {
            return (React.createElement(Badge, { outline: true, size: "sm" }, mapBoolean(paramObject)));
        }
        if (_.isNil(paramObject)) {
            return React.createElement(Badge, { outline: true, size: "sm" }, "null");
        }
        if (typeof paramObject !== 'object') {
            return paramObject;
        }
        return (React.createElement(Section, null, Object.entries(paramObject).map(([key, value]) => (React.createElement(FormGroup, null,
            React.createElement(Label, null, key),
            React.createElement(JSONBEntry, { paramObject: value }))))));
    }
}
export default class ShowJSONB extends React.PureComponent {
    render() {
        const { property, record } = this.props;
        const matchingParams = _.chain(record.params)
            .omitBy(_.isNil)
            .pickBy((value, key) => key.startsWith(property.name))
            .value();
        const unflattened = unflatten(matchingParams);
        const paramObject = flat.get(unflattened, property.name);
        return (React.createElement(FormGroup, null,
            React.createElement(Label, null, property.label),
            React.createElement(JSONBEntry, { paramObject: paramObject })));
    }
}
//# sourceMappingURL=ShowJSONB.js.map