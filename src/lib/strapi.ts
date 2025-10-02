// src/lib/strapi.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.zipsise.com';
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://api.zipsise.com/api';
const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

// Axios 인스턴스 생성
const strapiAPI: AxiosInstance = axios.create({
  baseURL: STRAPI_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 자동 추가
strapiAPI.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('strapi_jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    if (STRAPI_API_TOKEN) {
      config.headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
strapiAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      if (typeof window !== 'undefined') {
        localStorage.removeItem('strapi_jwt');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Strapi v5 응답 타입
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiDocument {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  [key: string]: any;
}

// API 클라이언트
export const strapiClient = {
  // ============= 인증 =============
  async login(identifier: string, password: string) {
    const response = await strapiAPI.post('/auth/local', {
      identifier,
      password,
    });
    
    if (response.data.jwt) {
      localStorage.setItem('strapi_jwt', response.data.jwt);
      localStorage.setItem('strapi_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async register(username: string, email: string, password: string) {
    const response = await strapiAPI.post('/auth/local/register', {
      username,
      email,
      password,
    });
    
    if (response.data.jwt) {
      localStorage.setItem('strapi_jwt', response.data.jwt);
      localStorage.setItem('strapi_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async logout() {
    localStorage.removeItem('strapi_jwt');
    localStorage.removeItem('strapi_user');
  },

  async getCurrentUser() {
    const response = await strapiAPI.get('/users/me');
    return response.data;
  },

  // ============= Collection CRUD =============
  
  // GET - 전체 목록 조회
  async getCollection<T = any>(
    collection: string,
    params?: {
      filters?: Record<string, any>;
      sort?: string | string[];
      populate?: string | string[] | Record<string, any>;
      pagination?: {
        page?: number;
        pageSize?: number;
        withCount?: boolean;
      };
      fields?: string[];
      publicationState?: 'live' | 'preview';
      locale?: string;
    }
  ): Promise<StrapiResponse<T[]>> {
    const response = await strapiAPI.get(`/${collection}`, { params });
    return response.data;
  },

  // GET - 단일 문서 조회 (documentId 사용)
  async getDocument<T = any>(
    collection: string,
    documentId: string,
    params?: {
      populate?: string | string[] | Record<string, any>;
      fields?: string[];
      locale?: string;
    }
  ): Promise<StrapiResponse<T>> {
    const response = await strapiAPI.get(`/${collection}/${documentId}`, { params });
    return response.data;
  },

  // POST - 새 문서 생성
  async createDocument<T = any>(
    collection: string,
    data: Partial<T>
  ): Promise<StrapiResponse<T>> {
    const response = await strapiAPI.post(`/${collection}`, { data });
    return response.data;
  },

  // PUT - 문서 업데이트 (documentId 사용)
  async updateDocument<T = any>(
    collection: string,
    documentId: string,
    data: Partial<T>
  ): Promise<StrapiResponse<T>> {
    const response = await strapiAPI.put(`/${collection}/${documentId}`, { data });
    return response.data;
  },

  // DELETE - 문서 삭제 (documentId 사용)
  async deleteDocument(
    collection: string,
    documentId: string
  ): Promise<StrapiResponse<any>> {
    const response = await strapiAPI.delete(`/${collection}/${documentId}`);
    return response.data;
  },

  // ============= 파일 업로드 =============
  async uploadFile(file: File, refId?: string, ref?: string, field?: string) {
    const formData = new FormData();
    formData.append('files', file);
    
    if (refId) formData.append('refId', refId);
    if (ref) formData.append('ref', ref);
    if (field) formData.append('field', field);

    const response = await strapiAPI.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // ============= 유틸리티 =============
  
  // 이미지 URL 생성
  getImageUrl(url?: string): string {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    return `${STRAPI_URL}${url}`;
  },

  // 토큰 확인
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('strapi_jwt');
  },

  // 저장된 사용자 정보 가져오기
  getStoredUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('strapi_user');
    return user ? JSON.parse(user) : null;
  },
};

// 기본 익스포트
export default strapiClient;