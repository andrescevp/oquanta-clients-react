/* tslint:disable */
/* eslint-disable */
/**
 * oQuanta Clients API
 * Internal Private API for oQuanta Clients APP
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Credentials
 */
export interface Credentials {
    /**
     * 
     * @type {string}
     * @memberof Credentials
     */
    'email'?: string;
    /**
     * 
     * @type {string}
     * @memberof Credentials
     */
    'password'?: string;
}
/**
 * 
 * @export
 * @interface GenericError
 */
export interface GenericError {
    /**
     * 
     * @type {number}
     * @memberof GenericError
     */
    'statusCode': number;
    /**
     * 
     * @type {string}
     * @memberof GenericError
     */
    'message': string;
}
/**
 * 
 * @export
 * @interface ModelValidationErrorModel
 */
export interface ModelValidationErrorModel {
    /**
     * 
     * @type {Array<ModelValidationErrorPathModel>}
     * @memberof ModelValidationErrorModel
     */
    'errors': Array<ModelValidationErrorPathModel>;
    /**
     * 
     * @type {number}
     * @memberof ModelValidationErrorModel
     */
    'statusCode': number;
    /**
     * 
     * @type {string}
     * @memberof ModelValidationErrorModel
     */
    'message': string;
}
/**
 * 
 * @export
 * @interface ModelValidationErrorPathModel
 */
export interface ModelValidationErrorPathModel {
    /**
     * 
     * @type {string}
     * @memberof ModelValidationErrorPathModel
     */
    'path': string;
    /**
     * 
     * @type {string}
     * @memberof ModelValidationErrorPathModel
     */
    'message': string;
}
/**
 * 
 * @export
 * @interface Token
 */
export interface Token {
    /**
     * 
     * @type {string}
     * @memberof Token
     */
    'token'?: string;
}
/**
 * 
 * @export
 * @interface User
 */
export interface User {
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'uuid'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'name'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof User
     */
    'lastName'?: string | null;
    /**
     * 
     * @type {Array<any>}
     * @memberof User
     */
    'roles'?: Array<any>;
}
/**
 * 
 * @export
 * @interface UserBasic
 */
export interface UserBasic {
    /**
     * 
     * @type {string}
     * @memberof UserBasic
     */
    'uuid'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserBasic
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserBasic
     */
    'name'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserBasic
     */
    'lastName'?: string | null;
}
/**
 * 
 * @export
 * @interface UserCreate
 */
export interface UserCreate {
    /**
     * 
     * @type {string}
     * @memberof UserCreate
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserCreate
     */
    'name'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserCreate
     */
    'lastName'?: string | null;
    /**
     * 
     * @type {Array<any>}
     * @memberof UserCreate
     */
    'roles'?: Array<any>;
}
/**
 * 
 * @export
 * @interface UserList
 */
export interface UserList {
    /**
     * 
     * @type {Array<any>}
     * @memberof UserList
     */
    'users'?: Array<any>;
    /**
     * 
     * @type {number}
     * @memberof UserList
     */
    'page': number;
    /**
     * 
     * @type {number}
     * @memberof UserList
     */
    'lastPage': number;
    /**
     * 
     * @type {number}
     * @memberof UserList
     */
    'nextPage'?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserList
     */
    'previousPage'?: number | null;
    /**
     * 
     * @type {number}
     * @memberof UserList
     */
    'count'?: number | null;
    /**
     * 
     * @type {Array<any>}
     * @memberof UserList
     */
    'results'?: Array<any> | null;
}
/**
 * 
 * @export
 * @interface UserResource2
 */
export interface UserResource2 {
    /**
     * 
     * @type {string}
     * @memberof UserResource2
     */
    'uuid'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserResource2
     */
    'email': string;
    /**
     * 
     * @type {string}
     * @memberof UserResource2
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof UserResource2
     */
    'lastName': string;
    /**
     * 
     * @type {Array<any>}
     * @memberof UserResource2
     */
    'roles'?: Array<any>;
}
/**
 * 
 * @export
 * @interface UserUpdate
 */
export interface UserUpdate {
    /**
     * 
     * @type {string}
     * @memberof UserUpdate
     */
    'email'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserUpdate
     */
    'name'?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserUpdate
     */
    'lastName'?: string | null;
    /**
     * 
     * @type {Array<any>}
     * @memberof UserUpdate
     */
    'roles'?: Array<any>;
}

/**
 * AuthApi - axios parameter creator
 * @export
 */
export const AuthApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get JWT token for authentication.
         * @param {Credentials} [credentials] Create new JWT Token
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthToken: async (credentials?: Credentials, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/login_check`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(credentials, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthApi - functional programming interface
 * @export
 */
export const AuthApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get JWT token for authentication.
         * @param {Credentials} [credentials] Create new JWT Token
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAuthToken(credentials?: Credentials, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Token>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAuthToken(credentials, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthApi.getAuthToken']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthApi - factory interface
 * @export
 */
export const AuthApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthApiFp(configuration)
    return {
        /**
         * 
         * @summary Get JWT token for authentication.
         * @param {Credentials} [credentials] Create new JWT Token
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthToken(credentials?: Credentials, options?: RawAxiosRequestConfig): AxiosPromise<Token> {
            return localVarFp.getAuthToken(credentials, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthApi - object-oriented interface
 * @export
 * @class AuthApi
 * @extends {BaseAPI}
 */
export class AuthApi extends BaseAPI {
    /**
     * 
     * @summary Get JWT token for authentication.
     * @param {Credentials} [credentials] Create new JWT Token
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthApi
     */
    public getAuthToken(credentials?: Credentials, options?: RawAxiosRequestConfig) {
        return AuthApiFp(this.configuration).getAuthToken(credentials, options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * UsersApi - axios parameter creator
 * @export
 */
export const UsersApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteApiUsersDelete: async (uuid: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uuid' is not null or undefined
            assertParamExists('deleteApiUsersDelete', 'uuid', uuid)
            const localVarPath = `/api/user/{uuid}`
                .replace(`{${"uuid"}}`, encodeURIComponent(String(uuid)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiUsersGet: async (uuid: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uuid' is not null or undefined
            assertParamExists('getApiUsersGet', 'uuid', uuid)
            const localVarPath = `/api/user/{uuid}`
                .replace(`{${"uuid"}}`, encodeURIComponent(String(uuid)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} [page] Page number
         * @param {number} [limit] Number of items per page
         * @param {string} [search] Search term
         * @param {string} [sort] Field to sort by (e.g. name)
         * @param {GetApiUsersListOrderEnum} [order] Sort direction (ASC or DESC)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiUsersList: async (page?: number, limit?: number, search?: string, sort?: string, order?: GetApiUsersListOrderEnum, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (limit !== undefined) {
                localVarQueryParameter['limit'] = limit;
            }

            if (search !== undefined) {
                localVarQueryParameter['search'] = search;
            }

            if (sort !== undefined) {
                localVarQueryParameter['sort'] = sort;
            }

            if (order !== undefined) {
                localVarQueryParameter['order'] = order;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {UserCreate} userCreate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postApiUsersCreate: async (userCreate: UserCreate, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'userCreate' is not null or undefined
            assertParamExists('postApiUsersCreate', 'userCreate', userCreate)
            const localVarPath = `/api/user`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(userCreate, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} uuid 
         * @param {UserUpdate} userUpdate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putApiUsersUpdate: async (uuid: string, userUpdate: UserUpdate, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'uuid' is not null or undefined
            assertParamExists('putApiUsersUpdate', 'uuid', uuid)
            // verify required parameter 'userUpdate' is not null or undefined
            assertParamExists('putApiUsersUpdate', 'userUpdate', userUpdate)
            const localVarPath = `/api/user/{uuid}`
                .replace(`{${"uuid"}}`, encodeURIComponent(String(uuid)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication Bearer required
            // http bearer authentication required
            await setBearerAuthToObject(localVarHeaderParameter, configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(userUpdate, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UsersApi - functional programming interface
 * @export
 */
export const UsersApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UsersApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteApiUsersDelete(uuid: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.deleteApiUsersDelete(uuid, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.deleteApiUsersDelete']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getApiUsersGet(uuid: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getApiUsersGet(uuid, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getApiUsersGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {number} [page] Page number
         * @param {number} [limit] Number of items per page
         * @param {string} [search] Search term
         * @param {string} [sort] Field to sort by (e.g. name)
         * @param {GetApiUsersListOrderEnum} [order] Sort direction (ASC or DESC)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getApiUsersList(page?: number, limit?: number, search?: string, sort?: string, order?: GetApiUsersListOrderEnum, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<UserList>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getApiUsersList(page, limit, search, sort, order, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.getApiUsersList']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {UserCreate} userCreate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async postApiUsersCreate(userCreate: UserCreate, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.postApiUsersCreate(userCreate, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.postApiUsersCreate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @param {string} uuid 
         * @param {UserUpdate} userUpdate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async putApiUsersUpdate(uuid: string, userUpdate: UserUpdate, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.putApiUsersUpdate(uuid, userUpdate, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['UsersApi.putApiUsersUpdate']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * UsersApi - factory interface
 * @export
 */
export const UsersApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UsersApiFp(configuration)
    return {
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteApiUsersDelete(uuid: string, options?: RawAxiosRequestConfig): AxiosPromise<void> {
            return localVarFp.deleteApiUsersDelete(uuid, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} uuid 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiUsersGet(uuid: string, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.getApiUsersGet(uuid, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} [page] Page number
         * @param {number} [limit] Number of items per page
         * @param {string} [search] Search term
         * @param {string} [sort] Field to sort by (e.g. name)
         * @param {GetApiUsersListOrderEnum} [order] Sort direction (ASC or DESC)
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiUsersList(page?: number, limit?: number, search?: string, sort?: string, order?: GetApiUsersListOrderEnum, options?: RawAxiosRequestConfig): AxiosPromise<UserList> {
            return localVarFp.getApiUsersList(page, limit, search, sort, order, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {UserCreate} userCreate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        postApiUsersCreate(userCreate: UserCreate, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.postApiUsersCreate(userCreate, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} uuid 
         * @param {UserUpdate} userUpdate 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        putApiUsersUpdate(uuid: string, userUpdate: UserUpdate, options?: RawAxiosRequestConfig): AxiosPromise<User> {
            return localVarFp.putApiUsersUpdate(uuid, userUpdate, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UsersApi - object-oriented interface
 * @export
 * @class UsersApi
 * @extends {BaseAPI}
 */
export class UsersApi extends BaseAPI {
    /**
     * 
     * @param {string} uuid 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public deleteApiUsersDelete(uuid: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).deleteApiUsersDelete(uuid, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} uuid 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getApiUsersGet(uuid: string, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getApiUsersGet(uuid, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} [page] Page number
     * @param {number} [limit] Number of items per page
     * @param {string} [search] Search term
     * @param {string} [sort] Field to sort by (e.g. name)
     * @param {GetApiUsersListOrderEnum} [order] Sort direction (ASC or DESC)
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public getApiUsersList(page?: number, limit?: number, search?: string, sort?: string, order?: GetApiUsersListOrderEnum, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).getApiUsersList(page, limit, search, sort, order, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {UserCreate} userCreate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public postApiUsersCreate(userCreate: UserCreate, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).postApiUsersCreate(userCreate, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} uuid 
     * @param {UserUpdate} userUpdate 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UsersApi
     */
    public putApiUsersUpdate(uuid: string, userUpdate: UserUpdate, options?: RawAxiosRequestConfig) {
        return UsersApiFp(this.configuration).putApiUsersUpdate(uuid, userUpdate, options).then((request) => request(this.axios, this.basePath));
    }
}

/**
 * @export
 */
export const GetApiUsersListOrderEnum = {
    Asc: 'ASC',
    Desc: 'DESC'
} as const;
export type GetApiUsersListOrderEnum = typeof GetApiUsersListOrderEnum[keyof typeof GetApiUsersListOrderEnum];


