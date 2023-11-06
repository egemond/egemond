export class AuthenticationResult {
  token: string;
  language: string;
  currency: string;
  theme: string;
}

export class TwoFactorAuthenticationConfigurationResult {
  secret: string;
  url: string;
}