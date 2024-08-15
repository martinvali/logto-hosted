import type { ConnectorMetadata } from '@logto/connector-kit';
import { ConnectorPlatform, ConnectorConfigFormItemType, OidcPrompt } from '@logto/connector-kit';

export const graphAPIEndpoint = 'https://graph.microsoft.com/v1.0/me';
export const scopes = ['User.Read'];

export const defaultMetadata: ConnectorMetadata = {
  id: 'webeid',
  target: 'WebeID',
  platform: ConnectorPlatform.Universal,
  name: {
    en: 'WebeID',
  },
  logo: './logo.svg',
  logoDark: null,
  description: {
    en: 'Webeid connector',
  },
  readme: './README.md',
  formItems: [{
    key: 'clientId',
    type: ConnectorConfigFormItemType.Text,
    required: true,
    label: 'Client ID',
    placeholder: '<client-id>',
  }],
};

export const defaultTimeout = 5000;
