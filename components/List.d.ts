import React from 'react';
export declare const REFRESH_KEY = "refresh";
import { ActionProps } from 'adminjs';
declare const OverridableList: React.ComponentType<ActionProps & {
    OriginalComponent?: React.ComponentType<ActionProps>;
}>;
export default OverridableList;
