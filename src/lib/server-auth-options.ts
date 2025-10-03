// path: src/lib/server-auth-options.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Strapi v5 REST 로그인:
 *   POST {identifier, password} -> { jwt, user }
 * 이 jwt를 NextAuth의 JWT/Session에 그대로 실어, 서버/클라이언트 공용으로 쓰게 한다.
 */
const STRAPI_API = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? ""; // e.g. https://api.zipsise.com/api

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Strapi Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const res = await fetch(`${STRAPI_API}/auth/local`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            identifier: credentials.identifier,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          // Strapi는 400에 {error:{message}}를 돌려주는 경우가 많다.
          try {
            const err = await res.json();
            throw new Error(err?.error?.message || `Strapi login failed (${res.status})`);
          } catch {
            throw new Error(`Strapi login failed (${res.status})`);
          }
        }

        const data = await res.json(); // { jwt, user }
        const { jwt, user } = data || {};
        if (!jwt || !user) return null;

        // NextAuth로 반환하는 객체는 jwt에 병합되어 저장된다.
        return {
          id: String(user.id ?? user.documentId ?? user.email ?? user.username ?? "me"),
          name: user.username ?? user.name ?? user.email ?? "User",
          email: user.email ?? undefined,
          jwt,                // ← 중요: 후속 요청에서 Bearer로 사용
          raw: user,          // (선택) 필요하면 세션에서 참고
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 로그인 시점에는 user가 있고, 이후에는 token만 순환
      if (user?.jwt) {
        token.jwt = (user as any).jwt;
        token.name = user.name ?? token.name;
        token.email = (user as any).email ?? token.email;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라이언트/서버에서 session.user.jwt로 접근 가능하게
      (session.user as any) = {
        ...session.user,
        jwt: (token as any).jwt,
      };
      return session;
    },
  },
  // 필요시 커스텀 로그인 페이지 경로 설정
  // pages: { signIn: "/login" },

  // 프로덕션에서 쿠키 도메인/보안 세팅이 필요하면 여기서 조정
  // cookies: { ... },
};
