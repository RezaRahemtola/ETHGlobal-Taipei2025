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

export type BodyChangeAvatarUserAvatarPost = {
    file: Blob | File;
};

export type GetTransactionsResponse = {
    transactions: Array<Transaction>;
};

export type HttpValidationError = {
    detail?: Array<ValidationError>;
};

/**
 * Response model for user search.
 */
export type SearchUsersResponse = {
    users: Array<UserSearchResult>;
};

export type ThirdwebWebhookPayload = {
    data: {
        [key: string]: unknown;
    };
};

export type Transaction = {
    receiver_username: string;
    sender_username: string;
    amount: number;
    type: 'topup' | 'p2p';
    transaction_hash: string;
    created_at: string;
};

/**
 * Model representing a user search result.
 */
export type UserSearchResult = {
    username: string;
    address: string;
    avatar_url: string;
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

export type GetAvatarUserAvatarGetData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/avatar';
};

export type GetAvatarUserAvatarGetErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type GetAvatarUserAvatarGetError = GetAvatarUserAvatarGetErrors[keyof GetAvatarUserAvatarGetErrors];

export type GetAvatarUserAvatarGetResponses = {
    /**
     * Successful Response
     */
    200: string;
};

export type GetAvatarUserAvatarGetResponse = GetAvatarUserAvatarGetResponses[keyof GetAvatarUserAvatarGetResponses];

export type ChangeAvatarUserAvatarPostData = {
    body: BodyChangeAvatarUserAvatarPost;
    path?: never;
    query?: never;
    url: '/user/avatar';
};

export type ChangeAvatarUserAvatarPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type ChangeAvatarUserAvatarPostError = ChangeAvatarUserAvatarPostErrors[keyof ChangeAvatarUserAvatarPostErrors];

export type ChangeAvatarUserAvatarPostResponses = {
    /**
     * Successful Response
     */
    200: string;
};

export type ChangeAvatarUserAvatarPostResponse = ChangeAvatarUserAvatarPostResponses[keyof ChangeAvatarUserAvatarPostResponses];

export type GetUserTransactionsUserTransactionsGetData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/user/transactions';
};

export type GetUserTransactionsUserTransactionsGetErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type GetUserTransactionsUserTransactionsGetError = GetUserTransactionsUserTransactionsGetErrors[keyof GetUserTransactionsUserTransactionsGetErrors];

export type GetUserTransactionsUserTransactionsGetResponses = {
    /**
     * Successful Response
     */
    200: GetTransactionsResponse;
};

export type GetUserTransactionsUserTransactionsGetResponse = GetUserTransactionsUserTransactionsGetResponses[keyof GetUserTransactionsUserTransactionsGetResponses];

export type SearchUsersUserSearchGetData = {
    body?: never;
    path?: never;
    query: {
        /**
         * Search query for username or address
         */
        query: string;
        /**
         * Maximum number of results to return
         */
        limit?: number;
    };
    url: '/user/search';
};

export type SearchUsersUserSearchGetErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type SearchUsersUserSearchGetError = SearchUsersUserSearchGetErrors[keyof SearchUsersUserSearchGetErrors];

export type SearchUsersUserSearchGetResponses = {
    /**
     * Successful Response
     */
    200: SearchUsersResponse;
};

export type SearchUsersUserSearchGetResponse = SearchUsersUserSearchGetResponses[keyof SearchUsersUserSearchGetResponses];

export type ThirdwebWebhookThirdwebWebhookPostData = {
    body: ThirdwebWebhookPayload;
    headers?: {
        'X-Pay-Signature'?: string;
        'X-Pay-Timestamp'?: string;
    };
    path?: never;
    query?: never;
    url: '/thirdweb/webhook';
};

export type ThirdwebWebhookThirdwebWebhookPostErrors = {
    /**
     * Validation Error
     */
    422: HttpValidationError;
};

export type ThirdwebWebhookThirdwebWebhookPostError = ThirdwebWebhookThirdwebWebhookPostErrors[keyof ThirdwebWebhookThirdwebWebhookPostErrors];

export type ThirdwebWebhookThirdwebWebhookPostResponses = {
    /**
     * Successful Response
     */
    200: unknown;
};

export type ClientOptions = {
    baseURL: 'http://localhost:8000' | (string & {});
};