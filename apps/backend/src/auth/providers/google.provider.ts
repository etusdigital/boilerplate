import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import {
  IdentityProvider,
  IdentityProviderUser,
} from './identity-provider.interface';

@Injectable()
export class GoogleProvider implements IdentityProvider {
  readonly providerName = 'google';
  private client: OAuth2Client;

  constructor(private config: ConfigService) {
    const clientId = config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new Error(
        'GOOGLE_CLIENT_ID is required when using GoogleProvider',
      );
    }
    this.client = new OAuth2Client(clientId);
  }

  /**
   * Verify a Google ID token and extract user information.
   *
   * @param idToken - Google ID token from client-side sign-in
   * @returns Standardized user information
   */
  async verifyToken(idToken: string): Promise<IdentityProviderUser> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.config.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google ID token: no payload');
    }

    if (!payload.email) {
      throw new Error('Invalid Google ID token: no email in payload');
    }

    return {
      providerId: `google|${payload.sub}`,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
      emailVerified: payload.email_verified ?? false,
    };
  }
}
