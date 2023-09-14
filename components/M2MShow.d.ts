import { RecordJSON, PropertyJSON } from 'adminjs';
import React from 'react';
type Props = {
    property: PropertyJSON;
    record: RecordJSON;
    ItemComponent: typeof React.Component;
};
export default function ManyToManyShow(props: Props): React.JSX.Element;
export {};
