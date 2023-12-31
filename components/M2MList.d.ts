import { RecordJSON, PropertyJSON } from 'adminjs';
import React, { ReactNode } from 'react';
type Props = {
    property: PropertyJSON;
    record: RecordJSON;
    ItemComponent: typeof React.Component;
};
export default class ManyToManyList extends React.PureComponent<Props> {
    render(): ReactNode;
}
export {};
