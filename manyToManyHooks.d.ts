import { RecordActionResponse, ResourceOptions, After } from 'adminjs';
export declare const after: After<RecordActionResponse>;
export declare const manyToManyComponent: (reference: string) => {
    isVisible: {
        list: boolean;
        show: boolean;
        filter: boolean;
        edit: boolean;
    };
    isArray: boolean;
    reference: string;
    components: {
        show: string;
        edit: string;
        list: string;
    };
};
export declare const injectManyToManySupport: (options: ResourceOptions, properties: {
    propertyName: string;
    modelClassName: string;
}[]) => ResourceOptions;
