import { Injectable } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import * as dotenv from 'dotenv';
import { v7 as uuidv7 } from 'uuid';

dotenv.config();

@Injectable()
export class Auth0Provider {
  private readonly managementClient: ManagementClient;

  constructor() {
    this.managementClient = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
    });
  }

  async sendInvitation(email: string, name: string): Promise<any> {
    try {

      const user: any = await this.managementClient.users.create({
        email,
        name,
        connection: process.env.AUTH0_CONNECTION_TYPE as string,
        email_verified: false,
        verify_email: false,
        password: uuidv7(),
      });

      const ticket = await this.managementClient.tickets.changePassword({
        connection_id: process.env.AUTH0_CONNECTION_ID,
        user_id: user.user_id,
        email: email,
        client_id: process.env.AUTH0_CLIENT_ID,
        mark_email_as_verified: false,
        ttl_sec: 0,
      });
      return ticket;
    } catch (error) {
      console.error('Error sending Auth0 invitation:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    return this.managementClient.usersByEmail.getByEmail({ email });
  }
}
