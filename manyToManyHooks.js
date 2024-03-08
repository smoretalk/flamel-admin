import flat from 'flat';
import { Components } from './componentLoader.js';
export const after = async (response, request, context) => {
    if (request && request.method) {
        const resource = context.resource;
        const manyProperties = resource.getManyProperties();
        const { record, _admin } = context;
        if (request.method === 'post' && record.isValid()) {
            const params = flat.unflatten(request.payload);
            await Promise.all(manyProperties.map(async (propertyDecorator) => {
                const toResourceId = propertyDecorator.name();
                let ids = params || [];
                let fromModel = resource.model.name;
                let targetModel = propertyDecorator.options.reference;
                if (toResourceId.includes('.')) {
                    const relations = toResourceId.split('.');
                    for (let i = 0; i < relations.length; i++) {
                        ids = ids[relations[i]];
                    }
                    fromModel = relations[0];
                }
                else {
                    ids = params[toResourceId];
                }
                if (!Array.isArray(ids)) {
                    return;
                }
                const idField = resource.client._runtimeDataModel.models[fromModel].fields.find((v) => v.isId);
                const targetIdField = resource.client._runtimeDataModel.models[targetModel].fields.find((v) => v.isId);
                await resource.saveRecords(idField.name, record.params[idField.name], toResourceId, targetIdField.name, ids);
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
        if (!options.properties) {
            options.properties = {};
        }
        options.properties[propForSupport.propertyName] = manyToManyComponent(propForSupport.modelClassName);
        if (!options.actions) {
            options.actions = {};
        }
        if (!options.actions.new) {
            options.actions.new = {};
        }
        if (!options.actions.edit) {
            options.actions.edit = {};
        }
        if (!options.actions.new.after) {
            options.actions.new.after = [after];
        }
        else if (Array.isArray(options.actions.new.after)) {
            const newAfter = options.actions.new.after;
            if (!newAfter.includes(after)) {
                newAfter.push(after);
            }
        }
        if (!options.actions.edit.after) {
            options.actions.edit.after = [after];
        }
        else if (Array.isArray(options.actions.edit.after)) {
            const editAfter = options.actions.edit.after;
            if (!editAfter.includes(after)) {
                editAfter.push(after);
            }
        }
    });
    return options;
};
//# sourceMappingURL=manyToManyHooks.js.map