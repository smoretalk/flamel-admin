import {
  RecordActionResponse,
  ResourceOptions, After, PropertyDecorator,
  flat, PropertyType
} from 'adminjs';
import { CustomResource } from './customResource.js';
import { Components } from './componentLoader.js';
import { DMMF } from '@prisma/client/runtime/library.js';

export const after: After<RecordActionResponse> = async (
  response,
  request,
  context,
) => {
  if (request && request.method) {
    const resource = context.resource as CustomResource;
    const manyProperties: PropertyDecorator[] = resource.getManyProperties();

    const { record, _admin } = context;

    if (request.method === 'post' && record.isValid()) {
      const params: { [k: string]: object } = flat.unflatten(request.payload);
      await Promise.all(
        manyProperties.map(async (propertyDecorator) => {
          // Image에서 CollectionInfo.CollectionKoTags를 수정하는 경우에
          const toResourceId = propertyDecorator.name();
          let ids: any = params || [];
          let fromModel = resource.model.name; // Image
          let targetModel = propertyDecorator.options.reference; // CollectionKoTag
          if (toResourceId.includes('.')) { // 릴레이션이면
            const relations = toResourceId.split('.');
            for (let i = 0; i < relations.length; i++) {
              ids = ids[relations[i]]; // 아이디는 CollectionKoTags의 아이디로
            }
            fromModel = relations[0]; // 여기서 CollectionInfo로 수정
          } else {
            ids = params[toResourceId];
          }
          if (!Array.isArray(ids)) { // 다대다 관계가 아니므로
            return;
          }
          const idField = (resource.client._runtimeDataModel.models[fromModel].fields as DMMF.Field[]).find((v) => v.isId);
          const targetIdField = (resource.client._runtimeDataModel.models[targetModel].fields as DMMF.Field[]).find((v) => v.isId);
          await resource.saveRecords(idField.name, record.params[idField.name], toResourceId, targetIdField.name, ids);
          // await context.resource.getRoles(record);
        }),
      );
    }
  }
  return response;
};
export const manyToManyComponent = (reference: string, pk?: string, searchKey?: string, title?: string) => ({
  isVisible: {
    list: true,
    show: true,
    filter: true,
    edit: true,
  },
  isArray: true,
  props: {
    pk,
    searchKey,
    title,
  },
  type: 'reference' as PropertyType,
  reference: reference,
  components: {
    show: Components.ManyToManyShow,
    edit: Components.ManyToManyEdit,
    list: Components.ManyToManyList,
    filter: Components.M2MFilter,
  },
});

export const injectManyToManySupport = (
  options: ResourceOptions,
  properties: { propertyName: string; modelClassName: string, pk?: string, searchKey?: string, title?: string }[],
): ResourceOptions => {
  properties.forEach((propForSupport) => {
    if (!options.properties) {
      options.properties = {};
    }
    options.properties[propForSupport.propertyName] = manyToManyComponent(
      propForSupport.modelClassName, propForSupport.pk, propForSupport.searchKey, propForSupport.title
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
