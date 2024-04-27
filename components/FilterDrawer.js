import { Box, Button, Drawer, DrawerContent, DrawerFooter, H3, Icon } from '@adminjs/design-system';
import isNil from 'lodash/isNil.js';
import pickBy from 'lodash/pickBy.js';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation, BasePropertyComponent, useQueryParams, useFilterDrawer, } from 'adminjs';
import flat from "flat";
export const getDataCss = (...args) => args.join('-');
export const getResourceElementCss = (resourceId, suffix) => getDataCss(resourceId, suffix);
const FilterDrawer = (props) => {
    const { resource } = props;
    const properties = resource.filterProperties;
    const [filter, setFilter] = useState({});
    console.log('filter', filter);
    const params = useParams();
    const { translateButton, translateLabel } = useTranslation();
    const initialLoad = useRef(true);
    const { isVisible, toggleFilter } = useFilterDrawer();
    const { storeParams, clearParams, filters } = useQueryParams();
    useEffect(() => {
        if (initialLoad.current) {
            initialLoad.current = false;
        }
        else {
            setFilter({});
        }
    }, [params.resourceId]);
    const handleSubmit = (event) => {
        event.preventDefault();
        storeParams({ filters: pickBy(filter, (v) => !isNil(v)), page: '1' });
    };
    const handleReset = (event) => {
        event.preventDefault();
        clearParams('filters');
        setFilter({});
    };
    useEffect(() => {
        if (filters) {
            setFilter(filters);
        }
    }, [filters]);
    const handleChange = (propertyName, value) => {
        if (propertyName.params) {
            throw new Error('you can not pass RecordJSON to filters');
        }
        console.log('propertyName', propertyName, value);
        const newData = flat.unflatten({
            ...filter,
            [propertyName]: typeof value === 'string' && !value.length ? undefined : value,
        }, { overwrite: true });
        console.log('newData', newData);
        setFilter(newData);
    };
    const contentTag = getResourceElementCss(resource.id, 'filter-drawer');
    const cssContent = getResourceElementCss(resource.id, 'filter-drawer-content');
    const cssFooter = getResourceElementCss(resource.id, 'filter-drawer-footer');
    const cssButtonApply = getResourceElementCss(resource.id, 'filter-drawer-button-apply');
    const cssButtonReset = getResourceElementCss(resource.id, 'filter-drawer-button-reset');
    return (React.createElement(Drawer, { variant: "filter", isHidden: !isVisible, as: "form", onSubmit: handleSubmit, onReset: handleReset, "data-css": contentTag },
        React.createElement(DrawerContent, { "data-css": cssContent },
            React.createElement(Box, { flex: true, justifyContent: "space-between" },
                React.createElement(H3, null, translateLabel('filters', resource.id)),
                React.createElement(Button, { type: "button", variant: "light", size: "icon", rounded: true, color: "text", onClick: toggleFilter },
                    React.createElement(Icon, { icon: "X" }))),
            React.createElement(Box, { my: "x3" }, properties.map((property) => (React.createElement(BasePropertyComponent, { key: property.propertyPath, where: "filter", onChange: handleChange, property: property, filter: flat.flatten(filter), resource: resource }))))),
        React.createElement(DrawerFooter, { "data-css": cssFooter },
            React.createElement(Button, { type: "button", variant: "light", onClick: handleReset, "data-css": cssButtonReset }, translateButton('resetFilter', resource.id)),
            React.createElement(Button, { type: "submit", variant: "contained", "data-css": cssButtonApply }, translateButton('applyChanges', resource.id)))));
};
export default FilterDrawer;
//# sourceMappingURL=FilterDrawer.js.map