// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.zipsise.com/api';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error('이메일과 비밀번호를 입력해주세요');
          }

          // Strapi 로그인 API 호출
          const response = await axios.post(`${STRAPI_API_URL}/auth/local`, {
            identifier: credentials.identifier,
            password: credentials.password,
          });

          if (response.data.jwt && response.data.user) {
            return {
              id: response.data.user.id.toString(),
              email: response.data.user.email,
              name: response.data.user.username,
              jwt: response.data.jwt,
              ...response.data.user,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Login error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.error?.message || '로그인에 실패했습니다');
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // 초기 로그인 시 user 정보를 token에 저장
      if (user) {
        token.jwt = (user as any).jwt;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {
      // session에 JWT 토큰과 사용자 정보 추가
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
        };
        (session as any).jwt = token.jwt;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };