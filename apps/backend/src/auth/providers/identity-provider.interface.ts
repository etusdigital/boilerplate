/**
 * Standardized user info returned from any identity provider
 */
export interface IdentityProviderUser {
  /** Provider-specific ID (e.g., 'google|123456', 'auth0|abc123') */
  providerId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

/**
 * Identity provider abstraction interface.
 * Allows the application to work with multiple OAuth/identity providers
 * (Auth0, Google, GitHub, etc.) through a common interface.
 */
export interface IdentityProvider {
  /** Unique identifier for this provider (e.g., 'google', 'auth0') */
  readonly providerName: string;

  /**
   * Verify an external token (ID token or access token) and return user info.
   * This is the primary method for authenticating users who sign in via OAuth.
   *
   * @param token - The ID token or access token from the provider
   * @returns User information extracted from the token
   * @throws Error if token verification fails
   */
  verifyToken(token: string): Promise<IdentityProviderUser>;

  /**
   * Optional: Send an invitation to create an account.
   * Primarily used for providers like Auth0 that support user management.
   *
   * @param email - Email address to invite
   * @param name - Name of the user being invited
   * @returns The created user ID and optional invitation ticket/URL
   */
  sendInvitation?(
    email: string,
    name: string,
  ): Promise<{ userId: string; ticket?: string }>;

  /**
   * Optional: Look up a user by email in the provider.
   *
   * @param email - Email to search for
   * @returns User info if found, null otherwise
   */
  getUserByEmail?(email: string): Promise<IdentityProviderUser | null>;

  /**
   * Optional: Revoke user's access/logout from provider.
   *
   * @param userId - Provider-specific user ID
   */
  revokeAccess?(userId: string): Promise<void>;
}
