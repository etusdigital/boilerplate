import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUsers200ResponseOneOfInner, ManagementClient } from 'auth0';
import { generateStrongPassword } from 'src/utils';

@Injectable()
export class Auth0Provider {
  private readonly managementClient: ManagementClient;

  constructor(private readonly configService: ConfigService) {
    this.managementClient = new ManagementClient({
      domain: configService.get<string>('AUTH0_DOMAIN')!,
      clientId: configService.get<string>('AUTH0_CLIENT_ID')!,
      clientSecret: configService.get<string>('AUTH0_CLIENT_SECRET')!,
    });
  }

  async sendInvitation(email: string, name: string): Promise<{ user: GetUsers200ResponseOneOfInner; ticket: string }> {
    try {
      const user = await this.managementClient.users.create({
        email,
        name,
        connection: this.configService.get<string>('AUTH0_CONNECTION_TYPE')!,
        email_verified: false,
        verify_email: false,
        password: generateStrongPassword(),
      });

      const ticket = await this.managementClient.tickets.changePassword({
        connection_id: this.configService.get<string>('AUTH0_CONNECTION_ID')!,
        email: email,
        mark_email_as_verified: false,
        ttl_sec: 0,
        result_url: this.configService.get<string>('FRONTEND_URL')!,
      });
      return { user: user.data, ticket: ticket.data.ticket };
    } catch (error) {
      console.error('Error sending Auth0 invitation:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<GetUsers200ResponseOneOfInner[]> {
    try {
      const user = await this.managementClient.usersByEmail.getByEmail({
        email,
      });
      return user.data;
    } catch (error) {
      console.error('Error getting Auth0 user by email:', error);
      throw error;
    }
  }
}
