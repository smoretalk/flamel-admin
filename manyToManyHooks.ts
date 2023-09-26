import {
  RecordActionResponse,
  ActionRequest,
  ActionContext,
  ResourceOptions, After, ActionResponse,
} from 'adminjs';
import flat from 'flat';
import { CustomResource } from './customResource.js';
import { Components } from './componentLoader.js';

//Role
const setResponseItems = async (
  context,
  response,
  reference: CustomResource,
) => {
  const { _admin, resource, record } = context;
  const toResource = reference;
  // const toResource = _admin.resources.find(resource: CustomResource => resource.getPropertyByKey() )
  const options = { order: [toResource.titleField()] };
  const throughItems = await resource.findRelated(record, reference, options);
  const items = toResource.wrapObjects(throughItems);
  if (items.length !== 0) {
    const primaryKeyField = toResource.primaryKeyField();
    console.log(
      '🚀 ~ file: many-to-many.hook.ts:20 ~ primaryKeyField',
      primaryKeyField,
    );
    // response.record.populated[reference] = items;
    // response.record.params[reference] = items.map(
    //   (v) => v.params[primaryKeyField || 'id'],
    // );
  }
};

export const after: After<ActionResponse> & After<RecordActionResponse> = async (
  response,
  request,
  context: any,
) => {
  if (request && request.method) {
    const manyProperties = context.resource.getManyProperties();

    console.log('m2m manyProperties', manyProperties.map((v) => v.name()));

    const { record, _admin } = context;

    if (request.method === 'post' && record.isValid()) {
      console.log('request.payload', request.payload);
      const params = flat.unflatten(request.payload);
      await Promise.all(
        manyProperties.map(async (propertyDecorator) => {
          const toResourceId = propertyDecorator.name();
          let ids = params || [];
          let fromModel = context.resource.model.name;
          let targetModel = toResourceId;
          if (toResourceId.includes('.')) { // 릴레이션이면
            const relations = toResourceId.split('.');
            for (let i = 0; i < relations.length; i++) {
              ids = ids[relations[i]] || [];
            }
            fromModel = relations[0];
            targetModel = relations[1];
          } else {
            ids = params[toResourceId] || [];
          }
          if (!Array.isArray(ids) || ids.length === 0) { // 다대다 관계가 아니므로
            return;
          }
          const idField = record.resource.client._runtimeDataModel.models[fromModel].fields.find((v) => v.isId);
          const targetIdField = record.resource.client._runtimeDataModel.models[targetModel].fields.find((v) => v.isId);
          console.log('idField', idField);
          await context.resource.saveRecords(idField.name, ids[idField.name], toResourceId, targetIdField.name, ids);
          // await context.resource.getRoles(record);
        }),
      );
    }
  }
  return response;
};
export const manyToManyComponent = (reference: string) => ({
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

export const injectManyToManySupport = (
  options: ResourceOptions,
  properties: { propertyName: string; modelClassName: string }[],
): ResourceOptions => {
  properties.forEach((propForSupport) => {
    if (!options.properties) {
      options.properties = {};
    }
    options.properties[propForSupport.propertyName] = manyToManyComponent(
      propForSupport.modelClassName,
    );
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
    } else if (Array.isArray(options.actions.new.after)) {
      if (!options.actions.new.after.includes(after)) {
        options.actions.new.after.push(after);
      }
    }
    if (!options.actions.edit.after) {
      options.actions.edit.after = [after];
    }
    else if (Array.isArray(options.actions.edit.after)) {
      if (!options.actions.edit.after.includes(after)) {
        options.actions.edit.after.push(after);
      }
    }
  });
  return options;
};
