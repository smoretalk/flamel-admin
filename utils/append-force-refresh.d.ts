export declare const REFRESH_KEY = "refresh";
export declare const IGNORE_PARAMS_KEY = "ignore_params";
export declare const appendForceRefresh: (url: string, search?: string) => string;
export declare const hasForceRefresh: (search: string) => boolean;
export declare const removeForceRefresh: (search: string) => string;
