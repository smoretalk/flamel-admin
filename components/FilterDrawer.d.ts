import React from 'react';
import { ResourceJSON } from 'adminjs';
export declare const getDataCss: (...args: string[]) => string;
export declare const getResourceElementCss: (resourceId: string, suffix: string) => string;
export type FilterProps = {
    resource: ResourceJSON;
};
declare const FilterDrawer: React.FC<FilterProps>;
export default FilterDrawer;
