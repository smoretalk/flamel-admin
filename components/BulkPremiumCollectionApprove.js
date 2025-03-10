import { Button, DrawerContent, DrawerFooter, Icon, MessageBox, Table, TableBody, TableCell, TableRow, Text } from '@adminjs/design-system';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ApiClient, ActionHeader, BasePropertyComponent, withNotice, useTranslation } from 'adminjs';
import { appendForceRefresh } from "../utils/append-force-refresh.js";
export const getActionElementCss = (resourceId, actionName, suffix) => `${resourceId}-${actionName}-${suffix}`;
const BulkPremiumCollectionApprove = (props) => {
    const { resource, records, action, addNotice } = props;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { translateMessage, translateButton } = useTranslation();
    if (!records) {
        return (React.createElement(Text, null, translateMessage('pickSomeFirstToRemove', resource.id)));
    }
    const handleClick = () => {
        const api = new ApiClient();
        setLoading(true);
        const recordIds = records.map((r) => r.id);
        api.bulkAction({
            resourceId: 'Image',
            actionName: action.name,
            recordIds,
            method: 'post',
        }).then(((response) => {
            setLoading(false);
            if (response.data.notice) {
                addNotice(response.data.notice);
            }
            if (response.data.redirectUrl) {
                const search = new URLSearchParams(window.location.search);
                search.delete('recordIds');
                navigate(appendForceRefresh(response.data.redirectUrl, search.toString()));
            }
        })).catch((error) => {
            setLoading(false);
            addNotice({
                message: translateMessage('bulkDeleteError', resource.id),
                type: 'error',
            });
            throw error;
        });
    };
    const contentTag = getActionElementCss(resource.id, action.name, 'drawer-content');
    const tableTag = getActionElementCss(resource.id, action.name, 'table');
    const footerTag = getActionElementCss(resource.id, action.name, 'drawer-footer');
    return (React.createElement(React.Fragment, null,
        React.createElement(DrawerContent, { "data-css": contentTag },
            action?.showInDrawer ? React.createElement(ActionHeader, { omitActions: true, ...props }) : null,
            React.createElement(MessageBox, { mb: "xxl", variant: "danger", message: translateMessage(records.length > 1 ? 'theseRecordsWillBeApproved_plural' : 'theseRecordsWillBeApproved', resource.id, { count: records.length }) }),
            React.createElement(Table, { "data-css": tableTag },
                React.createElement(TableBody, null, records.map((record) => (React.createElement(TableRow, { key: record.id },
                    React.createElement(TableCell, null,
                        React.createElement(BasePropertyComponent, { where: "list", property: resource.titleProperty, resource: resource, record: record })))))))),
        React.createElement(DrawerFooter, { "data-css": footerTag },
            React.createElement(Button, { variant: "contained", size: "lg", onClick: handleClick, disabled: loading },
                loading ? (React.createElement(Icon, { icon: "Loader", spin: true })) : null,
                translateButton(records.length > 1 ? 'confirmBulkPremiumCollectionApprove_plural' : 'confirmPremiumBulkCollectionApprove', resource.id, { count: records.length })))));
};
export default withNotice(BulkPremiumCollectionApprove);
//# sourceMappingURL=BulkPremiumCollectionApprove.js.map