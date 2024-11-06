import { RecordActionResponse, ResourceOptions, After, PropertyType } from 'adminjs';
export declare const after: After<RecordActionResponse>;
export declare const manyToManyComponent: (reference: string, pk?: string, searchKey?: string) => {
    isVisible: {
        list: boolean;
        show: boolean;
        filter: boolean;
        edit: boolean;
    };
    isArray: boolean;
    props: {
        pk: string;
        searchKey: string;
    };
    type: PropertyType;
    reference: string;
    components: {
        show: string;
        edit: string;
        list: string;
        filter: string;
    };
};
export declare const injectManyToManySupport: (options: ResourceOptions, properties: {
    propertyName: string;
    modelClassName: string;
    pk?: string;
    searchKey?: string;
}[]) => ResourceOptions;
