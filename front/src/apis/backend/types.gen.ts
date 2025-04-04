// This file is auto-generated by @hey-api/openapi-ts

export type AuthCheckUsernameResponse = {
    available: boolean;
};

export type AuthIsRegisteredResponse = {
    registered: boolean;
    username?: string | null;
};

export type AuthLoginRequest = {
    address: string;
    signature: string;
};

export type AuthLoginResponse = {
    access_token: string;
    address: string;
};

export type AuthMessageRequest = {
    address: string;
};

export type AuthMessageResponse = {
    message: string;
};

export type AuthRegisterRequest = {
    username: string;
};

export type AuthRegisterResponse = {
    success: boolean;
};

export type HttpValidationError = {
    detail?: Array<ValidationError>;
};

export type ValidationError = {
    loc: Array<string | number>;
    msg: string;
    type: string;
};

export type GetAuthMessageAuthMessagePostData = {
    body: AuthMessageRequest;
    path?: never;
    query?: never;
    url: '/auth/message';
};

export type GetAuthMessageAuthMessagePostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type GetAuthMessageAuthMessagePostError = GetAuthMessageAuthMessagePostErrors[keyof GetAuthMessageAuthMessagePostErrors];

export type GetAuthMessageAuthMessagePostResponses = {
    /**
     * Successful Response
     */
    200: AuthMessageResponse;
};

export type GetAuthMessageAuthMessagePostResponse = GetAuthMessageAuthMessagePostResponses[keyof GetAuthMessageAuthMessagePostResponses];

export type LoginWithWalletAuthLoginPostData = {
    body: AuthLoginRequest;
    path?: never;
    query?: never;
    url: '/auth/login';
};

export type LoginWithWalletAuthLoginPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type LoginWithWalletAuthLoginPostError = LoginWithWalletAuthLoginPostErrors[keyof LoginWithWalletAuthLoginPostErrors];

export type LoginWithWalletAuthLoginPostResponses = {
    /**
     * Successful Response
     */
    200: AuthLoginResponse;
};

export type LoginWithWalletAuthLoginPostResponse = LoginWithWalletAuthLoginPostResponses[keyof LoginWithWalletAuthLoginPostResponses];

export type RegisterUserAuthRegisterPostData = {
    body: AuthRegisterRequest;
    path?: never;
    query?: never;
    url: '/auth/register';
};

export type RegisterUserAuthRegisterPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type RegisterUserAuthRegisterPostError = RegisterUserAuthRegisterPostErrors[keyof RegisterUserAuthRegisterPostErrors];

export type RegisterUserAuthRegisterPostResponses = {
    /**
     * Successful Response
     */
    200: AuthRegisterResponse;
};

export type RegisterUserAuthRegisterPostResponse = RegisterUserAuthRegisterPostResponses[keyof RegisterUserAuthRegisterPostResponses];

export type CheckUsernameAuthAvailableEnsUsernameGetData = {
    body?: never;
    path: {
        username: string;
    };
    query?: never;
    url: '/auth/available-ens/{username}';
};

export type CheckUsernameAuthAvailableEnsUsernameGetErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type CheckUsernameAuthAvailableEnsUsernameGetError = CheckUsernameAuthAvailableEnsUsernameGetErrors[keyof CheckUsernameAuthAvailableEnsUsernameGetErrors];

export type CheckUsernameAuthAvailableEnsUsernameGetResponses = {
    /**
     * Successful Response
     */
    200: AuthCheckUsernameResponse;
};

export type CheckUsernameAuthAvailableEnsUsernameGetResponse = CheckUsernameAuthAvailableEnsUsernameGetResponses[keyof CheckUsernameAuthAvailableEnsUsernameGetResponses];

export type IsRegisteredAuthIsRegisteredGetData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/auth/is-registered';
};

export type IsRegisteredAuthIsRegisteredGetErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type IsRegisteredAuthIsRegisteredGetError = IsRegisteredAuthIsRegisteredGetErrors[keyof IsRegisteredAuthIsRegisteredGetErrors];

export type IsRegisteredAuthIsRegisteredGetResponses = {
    /**
     * Successful Response
     */
    200: AuthIsRegisteredResponse;
};

export type IsRegisteredAuthIsRegisteredGetResponse = IsRegisteredAuthIsRegisteredGetResponses[keyof IsRegisteredAuthIsRegisteredGetResponses];

export type ClientOptions = {
    baseURL: 'http://localhost:8000' | (string & {});
};