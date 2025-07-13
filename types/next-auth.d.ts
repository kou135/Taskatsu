// types/next-auth.d.ts
declare module "next-auth" {
    interface Session {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: number;
    }
}