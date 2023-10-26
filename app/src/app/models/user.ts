export class User {
  _id: string;
  email: string;
  password?: string;
  language?: string;
  theme?: string;
  twoFactorAuthentication?: {
    enabled: boolean,
  };
}
