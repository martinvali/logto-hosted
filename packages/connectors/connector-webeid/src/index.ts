import { assert, conditional } from '@silverhand/essentials';
import { got, HTTPError } from 'got';
import path from 'node:path';

import type { AuthorizationCodeRequest, AuthorizationUrlRequest } from '@azure/msal-node';
import { ConfidentialClientApplication } from '@azure/msal-node';
import type {
  GetAuthorizationUri,
  GetUserInfo,
  GetConnectorConfig,
  CreateConnector,
  SocialConnector,
} from '@logto/connector-kit';
import {
  ConnectorError,
  ConnectorErrorCodes,
  validateConfig,
  ConnectorType,
  parseJson,
} from '@logto/connector-kit';

import { scopes, defaultMetadata, defaultTimeout, graphAPIEndpoint } from './constant.js';
import type { AzureADConfig } from './types.js';
import {
  azureADConfigGuard,
  accessTokenResponseGuard,
  userInfoResponseGuard,
  authResponseGuard,
} from './types.js';

// eslint-disable-next-line @silverhand/fp/no-let
let authCodeRequest: AuthorizationCodeRequest;

const API_ENDPOINT = "https://uptimedevelopment.org";
const getAuthorizationUri =
  (getConfig: GetConnectorConfig): GetAuthorizationUri =>
  async ({state, redirectUri}, setSession) => {
    console.log(state);
    console.log(redirectUri);

    const queryParameters = new URLSearchParams({
      state,
      redirect_uri: redirectUri
    });

    return `${API_ENDPOINT}/auth/id-card-login?${queryParameters.toString()}`;
  };


const getAccessToken = async (config: AzureADConfig, code: string, redirectUri: string) => {
  console.log("config", config);
  console.log("code", code);
  console.log("redirect", redirectUri);
  console.log("GETACCESSTOKEN");
  /*
  const codeRequest: AuthorizationCodeRequest = {
    ...authCodeRequest,
    redirectUri,
    scopes: ['User.Read'],
    code,
  };

  const { clientId, clientSecret, cloudInstance, tenantId } = config;

  const clientApplication = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: new URL(path.join(cloudInstance, tenantId)).toString(),
    },
  });

  const authResult = await clientApplication.acquireTokenByCode(codeRequest);
  const result = accessTokenResponseGuard.safeParse(authResult);

  if (!result.success) {
    throw new ConnectorError(ConnectorErrorCodes.InvalidResponse, result.error);
  }

  const { accessToken } = result.data;

  assert(accessToken, new ConnectorError(ConnectorErrorCodes.SocialAuthCodeInvalid));

  return { accessToken };*/

  return {accessToken: "1234"}
};

const getUserInfo =
  (getConfig: GetConnectorConfig): GetUserInfo =>
  async (data) => {
    console.log("data", data);
    try {
    const profileResponse = await fetch(`${API_ENDPOINT}/auth/profile`);
    const profile = await profileResponse.json();
    console.log("Profile is", profile);
    return {
      id: profile.id
    }
  }
  catch(error) {
    throw new Error("Something went wrong.");
  }
  };


const createAzureAdConnector: CreateConnector<SocialConnector> = async ({ getConfig }) => {
  return {
    metadata: defaultMetadata,
    type: ConnectorType.Social,
    configGuard: azureADConfigGuard,
    getAuthorizationUri: getAuthorizationUri(getConfig),
    getUserInfo: getUserInfo(getConfig),
  };
};

export default createAzureAdConnector;
