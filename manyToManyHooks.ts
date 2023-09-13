import {
  RecordActionResponse,
  ActionRequest,
  ActionContext,
  ResourceOptions,
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

export const after = async (
  response: RecordActionResponse,
  request: ActionRequest,
  context: any,
) => {
  if (request && request.method) {
    const manyProperties = context.resource.getManyProperties();
    const manyReferences = context.resource.getManyReferences();
    console.log('manyProperties', manyProperties);
    console.log('manyReferences', manyReferences);

    const { record, _admin } = context;
    // console.log( '🚀 ~ file: many-to-many.hook.ts:34 ~ _admin',
    //   _admin.resources,
    // );
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
      // await Promise.all(
      //   manyReferences.map(async (reference: CustomResource) => {
      //     await setResponseItems(context, response, reference);
      //   }),
      // );
    }

    if (request.method === 'post' && record.isValid()) {
      const params = flat.unflatten(request.payload);
      await Promise.all(
        manyProperties.map(async (toResourceId: string) => {
          let ids = params || [];
          if (toResourceId.includes('.')) { // 릴레이션이면
            const relations = toResourceId.split('.');
            for (let i = 0; i < relations.length; i++) {
              ids = ids[relations[i]] || [];
            }
          } else {
            ids = params[toResourceId] || [];
          }
          await context.resource.saveRecords(record, toResourceId, ids);
          // await context.resource.getRoles(record);
        }),
      );
    }
  }
  // if (request && request.method) {
  //   const manyProperties = context.resource.getManyProperties();
  //   if (context.action.name == 'edit' && request.method === 'get') {
  //     // Load all linked data
  //     await Promise.all(
  //       manyProperties.map(async (toResourceId) => {
  //         await setResponseItems(context, response, toResourceId);
  //       }),
  //     );
  //   }
  //   const { record } = context;
  //   if (request.method === 'post' && record.isValid()) {
  //     const params = unflatten(request.payload);
  // await Promise.all(
  //   manyProperties.map(async (toResourceId) => {
  //     const ids = params[toResourceId]
  //       ? params[toResourceId].map((v) => parseInt(v))
  //       : [];
  //     await context.resource.saveRecords(record, toResourceId, ids);
  //   }),
  // );
  //   }
  // }
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
    options.properties[propForSupport.propertyName] = manyToManyComponent(
      propForSupport.modelClassName,
    );
    options.actions.new.after = [after];
    options.actions.edit.after = [after];
  });
  return options;
};