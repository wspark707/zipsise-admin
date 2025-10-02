// src/types/index.ts

// ============= Strapi 기본 타입 =============
export interface StrapiDocument {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiUser extends StrapiDocument {
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  role?: StrapiRole;
}

export interface StrapiRole {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface StrapiMedia extends StrapiDocument {
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: MediaFormat;
    small?: MediaFormat;
    medium?: MediaFormat;
    large?: MediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
}

export interface MediaFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// ============= API 응답 타입 =============
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

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
  };
}

// ============= 인증 타입 =============
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// ============= Collection 설정 타입 =============
export interface CollectionConfig {
  name: string;
  displayName: string;
  icon?: string;
  description?: string;
  fields: FieldConfig[];
  searchableFields?: string[];
  defaultSort?: string;
  itemsPerPage?: number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: 
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'richtext'
    | 'date'
    | 'datetime'
    | 'boolean'
    | 'select'
    | 'relation'
    | 'media'
    | 'json';
  required?: boolean;
  unique?: boolean;
  showInList?: boolean;
  showInForm?: boolean;
  showInDetail?: boolean;
  options?: SelectOption[];
  relation?: RelationConfig;
  validation?: ValidationConfig;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface RelationConfig {
  collection: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  displayField: string;
}

export interface ValidationConfig {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: (value: any) => boolean | string;
}

// ============= 테이블 타입 =============
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface FilterState {
  [key: string]: any;
}

export interface SortState {
  field: string;
  order: 'asc' | 'desc';
}

// ============= 폼 타입 =============
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  values: Record<string, any>;
}

export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
}

// ============= 유틸리티 타입 =============
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============= 앱 상태 타입 =============
export interface AppState {
  user: StrapiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: MenuItem[];
}