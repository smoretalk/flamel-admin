import { RecordActionResponse, ActionRequest, ResourceOptions } from 'adminjs';
export declare const after: (response: RecordActionResponse, request: ActionRequest, context: any) => Promise<RecordActionResponse>;
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
