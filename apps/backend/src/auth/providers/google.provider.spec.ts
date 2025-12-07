import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleProvider } from './google.provider';

// Mock google-auth-library
const mockVerifyIdToken = jest.fn();
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

describe('GoogleProvider', () => {
  let provider: GoogleProvider;
  let mockConfigService: Partial<ConfigService>;

  const mockGoogleClientId = 'test-google-client-id.apps.googleusercontent.com';

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return mockGoogleClientId;
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleProvider,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    provider = module.get<GoogleProvider>(GoogleProvider);
  });

  describe('constructor', () => {
    it('should throw error when GOOGLE_CLIENT_ID is not set', async () => {
      const configWithoutClientId = {
        get: jest.fn().mockReturnValue(undefined),
      };

      await expect(
        Test.createTestingModule({
          providers: [
            GoogleProvider,
            { provide: ConfigService, useValue: configWithoutClientId },
          ],
        }).compile(),
      ).rejects.toThrow('GOOGLE_CLIENT_ID is required');
    });

    it('should create OAuth2Client with correct client ID', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { OAuth2Client } = require('google-auth-library');
      expect(OAuth2Client).toHaveBeenCalledWith(mockGoogleClientId);
    });
  });

  describe('providerName', () => {
    it('should return "google"', () => {
      expect(provider.providerName).toBe('google');
    });
  });

  describe('verifyToken', () => {
    const validPayload = {
      sub: '123456789',
      email: 'user@example.com',
      name: 'Test User',
      picture: 'https://example.com/photo.jpg',
      email_verified: true,
    };

    it('should return IdentityProviderUser for valid token', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => validPayload,
      });

      const result = await provider.verifyToken('valid-id-token');

      expect(result).toEqual({
        providerId: 'google|123456789',
        email: 'user@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
        emailVerified: true,
      });
    });

    it('should call verifyIdToken with correct parameters', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => validPayload,
      });

      await provider.verifyToken('test-token');

      expect(mockVerifyIdToken).toHaveBeenCalledWith({
        idToken: 'test-token',
        audience: mockGoogleClientId,
      });
    });

    it('should use email prefix as name when name is not provided', async () => {
      const payloadWithoutName = {
        ...validPayload,
        name: undefined,
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => payloadWithoutName,
      });

      const result = await provider.verifyToken('valid-token');

      expect(result.name).toBe('user'); // email prefix
    });

    it('should default emailVerified to false when not provided', async () => {
      const payloadWithoutVerified = {
        ...validPayload,
        email_verified: undefined,
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => payloadWithoutVerified,
      });

      const result = await provider.verifyToken('valid-token');

      expect(result.emailVerified).toBe(false);
    });

    it('should throw error when payload is null', async () => {
      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => null,
      });

      await expect(provider.verifyToken('invalid-token')).rejects.toThrow(
        'Invalid Google ID token: no payload',
      );
    });

    it('should throw error when email is missing from payload', async () => {
      const payloadWithoutEmail = {
        ...validPayload,
        email: undefined,
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => payloadWithoutEmail,
      });

      await expect(provider.verifyToken('token-without-email')).rejects.toThrow(
        'Invalid Google ID token: no email',
      );
    });

    it('should propagate errors from verifyIdToken', async () => {
      mockVerifyIdToken.mockRejectedValue(
        new Error('Token verification failed'),
      );

      await expect(provider.verifyToken('invalid-token')).rejects.toThrow(
        'Token verification failed',
      );
    });

    it('should handle picture being undefined', async () => {
      const payloadWithoutPicture = {
        ...validPayload,
        picture: undefined,
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => payloadWithoutPicture,
      });

      const result = await provider.verifyToken('valid-token');

      expect(result.picture).toBeUndefined();
    });

    it('should format providerId correctly with google prefix', async () => {
      const payloadWithDifferentSub = {
        ...validPayload,
        sub: 'abc123xyz',
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => payloadWithDifferentSub,
      });

      const result = await provider.verifyToken('valid-token');

      expect(result.providerId).toBe('google|abc123xyz');
    });
  });
});
