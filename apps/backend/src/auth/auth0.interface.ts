export interface Auth0TokenPayload {
  iss: string;
  sub: string;
  aud: string[] | string;
  iat: number;
  exp: number;
  scope: string;
  azp: string;
  permissions: string[];
  identities: string[];
  [key: string]: unknown;
}
