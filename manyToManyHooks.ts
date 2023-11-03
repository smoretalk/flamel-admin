import {
  RecordActionResponse,
  ResourceOptions, After, PropertyDecorator,
} from 'adminjs';
import flat from 'flat';
import { CustomResource } from './customResource.js';
import { Components } from './componentLoader.js';
import type { DMMF } from '@prisma/client/runtime/library.js';

export const after: After<RecordActionResponse> = async (
  response,
  request,
  context,
) => {
  if (request && request.method) {
    const resource = context.resource as CustomResource;
    const manyProperties: PropertyDecorator[] = resource.getManyProperties();

    console.log('m2m manyProperties', manyProperties.map((v) => v.name()));

    const { record, _admin } = context;

    if (request.method === 'post' && record.isValid()) {
      console.log('request.payload', request.payload);
      const params: { [k: string]: object } = flat.unflatten(request.payload);
      await Promise.all(
        manyProperties.map(async (propertyDecorator) => {
          const toResourceId = propertyDecorator.name();
          let ids: any = params || [];
          let fromModel = resource.model.name;
          let targetModel = toResourceId.slice(0, -1); // TODO: 현재는 CollectionKoTags를 CollectionKoTag로 바꾸는 정도
          if (toResourceId.includes('.')) { // 릴레이션이면
            const relations = toResourceId.split('.');
            for (let i = 0; i < relations.length; i++) {
              ids = ids[relations[i]] || [];
            }
            fromModel = relations[0];
            targetModel = relations[1].slice(0, -1);
          } else {
            ids = params[toResourceId] || [];
          }
          if (!Array.isArray(ids) || ids.length === 0) { // 다대다 관계가 아니므로
            return;
          }
          const idField = (resource.client._runtimeDataModel.models[fromModel].fields as DMMF.Field[]).find((v) => v.isId);
          const targetIdField = (resource.client._runtimeDataModel.models[targetModel].fields as DMMF.Field[]).find((v) => v.isId);
          console.log('idField', idField);
          await resource.saveRecords(idField.name, record.params[idField.name], toResourceId, targetIdField.name, ids);
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
      const newAfter = options.actions.new.after as After<RecordActionResponse>[];
      if (!newAfter.includes(after)) {
        newAfter.push(after);
      }
    }
    if (!options.actions.edit.after) {
      options.actions.edit.after = [after];
    }
    else if (Array.isArray(options.actions.edit.after)) {
      const editAfter = options.actions.edit.after as After<RecordActionResponse>[];
      if (!editAfter.includes(after)) {
        editAfter.push(after);
      }
    }
  });
  return options;
};
