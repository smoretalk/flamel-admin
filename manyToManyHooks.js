import flat from 'flat';
import { Components } from './componentLoader.js';
const setResponseItems = async (context, response, reference) => {
    const { _admin, resource, record } = context;
    const toResource = reference;
    const options = { order: [toResource.titleField()] };
    const throughItems = await resource.findRelated(record, reference, options);
    const items = toResource.wrapObjects(throughItems);
    if (items.length !== 0) {
        const primaryKeyField = toResource.primaryKeyField();
        console.log('🚀 ~ file: many-to-many.hook.ts:20 ~ primaryKeyField', primaryKeyField);
    }
};
export const after = async (response, request, context) => {
    if (request && request.method) {
        const manyProperties = context.resource.getManyProperties();
        const manyReferences = context.resource.getManyReferences();
        console.log('manyProperties', manyProperties);
        console.log('manyReferences', manyReferences);
        const { record, _admin } = context;
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };
        if (context.action.name == 'edit' && request.method === 'get') {
        }
        if (request.method === 'post' && record.isValid()) {
            const params = flat.unflatten(request.payload);
            await Promise.all(manyProperties.map(async (toResourceId) => {
                let ids = params || [];
                if (toResourceId.includes('.')) {
                    const relations = toResourceId.split('.');
                    for (let i = 0; i < relations.length; i++) {
                        ids = ids[relations[i]] || [];
                    }
                }
                else {
                    ids = params[toResourceId] || [];
                }
                await context.resource.saveRecords(record, toResourceId, ids);
            }));
        }
    }
    return response;
};
export const manyToManyComponent = (reference) => ({
    isVisible: {
        list: true,
        show: true,
        filter: true,
        edit: true,
    },
    isArray: true,
    reference: reference,
    components: {
        show: Components.ManyToManyShow,
        edit: Components.ManyToManyEdit,
        list: Components.ManyToManyList,
    },
});
export const injectManyToManySupport = (options, properties) => {
    properties.forEach((propForSupport) => {
        options.properties[propForSupport.propertyName] = manyToManyComponent(propForSupport.modelClassName);
        options.actions.new.after = [after];
        options.actions.edit.after = [after];
    });
    return options;
};
//# sourceMappingURL=manyToManyHooks.js.map