import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Account } from "next-auth";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: JWT;
      account?: Account | null;
    }) {
      // 初回サインイン時（accountが存在する場合）
      if (account) {
        console.log("【jwtコールバック】初回サインイン時のaccount:", account);
        console.log("【jwtコールバック】保存前のtoken:", token);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        console.log("【jwtコールバック】保存後のtoken:", token);
      }
      
      // トークンの有効期限チェック
      if (token.expiresAt && Date.now() > (token.expiresAt as number) * 1000) {
        console.log("トークン期限切れ - リフレッシュが必要");
        try {
          const url = "https://oauth2.googleapis.com/token";
          const params = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          };
    
          const response = await axios.post(url, null, { params });
          const refreshedTokens = response.data;
    
          token.accessToken = refreshedTokens.access_token;
          token.expiresAt = Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;
          // Googleはrefresh_tokenを返さない場合が多いので、既存のrefreshTokenを維持
          console.log("リフレッシュ成功:", refreshedTokens);
        } catch (error) {
          console.error("リフレッシュ失敗:", error);
          // 必要に応じてtokenを無効化（例: サインアウトさせる）
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      
      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      // JWTトークンからアクセストークン等をセッションに追加
      console.log("【sessionコールバック】受け取ったtoken:", token);
      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.expiresAt = token.expiresAt as number | undefined;
      console.log("【sessionコールバック】返すsession:", session);
      return session;
    },

    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };