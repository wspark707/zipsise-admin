# 집시세 인트라넷 관리 시스템

Next.js 15 + Strapi v5 기반의 직원 전용 인트라넷 관리 시스템입니다.

## 🚀 주요 기능

- ✅ **Strapi v5 완벽 연동** - documentId 기반 최신 API 사용
- ✅ **자동 CRUD 생성** - 설정만으로 모든 Collection CRUD 자동 생성
- ✅ **모던 UI/UX** - shadcn/ui + Tailwind CSS
- ✅ **인증 시스템** - NextAuth.js + Strapi JWT
- ✅ **반응형 디자인** - 모바일/태블릿/데스크톱 지원
- ✅ **TypeScript** - 타입 안전성 보장

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
cd /var/www/zipsise/zp-admin
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_STRAPI_URL=https://api.zipsise.com
NEXT_PUBLIC_STRAPI_API_URL=https://api.zipsise.com/api
NEXTAUTH_URL=https://admin.zipsise.com
NEXTAUTH_SECRET=your-super-secret-key-change-this
NEXT_PUBLIC_APP_NAME=집시세 인트라넷
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버: http://localhost:3000

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 🎯 새로운 Collection CRUD 추가하기

### 단 3단계로 완성!

#### 1️⃣ Collection 설정 추가

`src/lib/collection-config.ts` 파일에 새로운 Collection 추가:

```typescript
export const collections: Record<string, CollectionConfig> = {
  // ... 기존 collections

  // 새로운 Collection 추가
  products: {
    name: 'products',
    displayName: '상품',
    icon: Package,  // lucide-react 아이콘
    description: '상품 관리',
    searchableFields: ['name', 'description'],
    defaultSort: 'createdAt:desc',
    itemsPerPage: 10,
    fields: [
      {
        name: 'id',
        label: 'ID',
        type: 'number',
        showInList: true,
        showInForm: false,
        showInDetail: true,
      },
      {
        name: 'name',
        label: '상품명',
        type: 'text',
        required: true,
        showInList: true,
        showInForm: true,
        showInDetail: true,
      },
      {
        name: 'price',
        label: '가격',
        type: 'number',
        required: true,
        showInList: true,
        showInForm: true,
        showInDetail: true,
      },
      {
        name: 'description',
        label: '설명',
        type: 'textarea',
        showInList: false,
        showInForm: true,
        showInDetail: true,
      },
      {
        name: 'available',
        label: '판매 가능',
        type: 'boolean',
        showInList: true,
        showInForm: true,
        showInDetail: true,
        defaultValue: true,
      },
      {
        name: 'createdAt',
        label: '생성일',
        type: 'datetime',
        showInList: true,
        showInForm: false,
        showInDetail: true,
      },
    ],
  },
};
```

#### 2️⃣ 페이지 파일 생성

목록 페이지: `src/app/(dashboard)/products/page.tsx`
```typescript
import GenericList from '@/components/crud/generic-list';
import { getCollectionConfig } from '@/lib/collection-config';

export default function ProductsPage() {
  const config = getCollectionConfig('products');
  if (!config) return <div>Collection not found</div>;
  return <GenericList config={config} />;
}
```

생성 페이지: `src/app/(dashboard)/products/create/page.tsx`
```typescript
import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function CreateProductPage() {
  const config = getCollectionConfig('products');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} mode="create" />;
}
```

수정 페이지: `src/app/(dashboard)/products/[id]/edit/page.tsx`
```typescript
import GenericForm from '@/components/crud/generic-form';
import { getCollectionConfig } from '@/lib/collection-config';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const config = getCollectionConfig('products');
  if (!config) return <div>Collection not found</div>;
  return <GenericForm config={config} documentId={params.id} mode="edit" />;
}
```

#### 3️⃣ 메뉴 추가

`src/components/layout/admin-layout.tsx`의 `menuItems` 배열에 추가:

```typescript
const menuItems: MenuItem[] = [
  { label: '대시보드', href: '/', icon: Home },
  { label: '사용자', href: '/users', icon: Users },
  { label: '상품', href: '/products', icon: Package },  // 추가!
  { label: '설정', href: '/settings', icon: Settings },
];
```

**끝! 이제 완전한 CRUD가 동작합니다! 🎉**

## 📁 프로젝트 구조

```
zp-admin/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # 인증 필요한 페이지
│   │   │   ├── layout.tsx        # 대시보드 레이아웃
│   │   │   ├── page.tsx          # 대시보드 메인
│   │   │   ├── users/            # 사용자 CRUD
│   │   │   ├── articles/         # 게시글 CRUD
│   │   │   └── [collection]/     # 기타 Collection CRUD
│   │   ├── api/
│   │   │   └── auth/             # NextAuth API
│   │   ├── login/                # 로그인 페이지
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── providers.tsx         # Provider 설정
│   │   └── globals.css           # 전역 스타일
│   ├── components/
│   │   ├── crud/                 # CRUD 공통 컴포넌트
│   │   │   ├── data-table.tsx    # 데이터 테이블
│   │   │   ├── generic-list.tsx  # 범용 목록
│   │   │   └── generic-form.tsx  # 범용 폼
│   │   ├── layout/               # 레이아웃 컴포넌트
│   │   │   └── admin-layout.tsx  # 관리자 레이아웃
│   │   └── ui/                   # shadcn/ui 컴포넌트
│   ├── lib/
│   │   ├── strapi.ts             # Strapi API 클라이언트
│   │   ├── collection-config.ts  # Collection 설정
│   │   └── utils.ts              # 유틸리티
│   ├── types/
│   │   └── index.ts              # TypeScript 타입
│   └── hooks/
│       └── use-toast.ts          # Toast Hook
├── .env.local                    # 환경 변수
└── package.json                  # 의존성
```

## 🎨 Field Types

Collection 설정에서 사용 가능한 필드 타입:

- `text` - 단일 텍스트
- `email` - 이메일
- `number` - 숫자
- `textarea` - 여러 줄 텍스트
- `richtext` - 리치 텍스트 에디터
- `date` - 날짜
- `datetime` - 날짜/시간
- `boolean` - 스위치
- `select` - 선택 박스 (구현 예정)
- `relation` - 관계 필드 (구현 예정)
- `media` - 파일/이미지 (구현 예정)

## 🔐 인증

- Strapi JWT 토큰 기반 인증
- NextAuth.js 세션 관리
- 자동 토큰 갱신
- 로그인 페이지: `/login`

## 🛠️ 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Strapi v5
- **Auth**: NextAuth.js
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Date**: date-fns

## 📝 Strapi v5 주요 변경사항

- `id` → `documentId` 사용 권장
- 더 간결한 API 응답 구조
- 향상된 필터링/정렬 기능

## 🚀 배포

### Vercel 배포

```bash
vercel --prod
```

### 환경 변수 설정 필수!

Vercel 대시보드에서 환경 변수 추가:
- `NEXT_PUBLIC_STRAPI_URL`
- `NEXT_PUBLIC_STRAPI_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 💡 팁

### 1. 빠른 CRUD 생성

새로운 Collection은 3개 파일만 생성하면 됩니다:
- `[collection]/page.tsx`
- `[collection]/create/page.tsx`
- `[collection]/[id]/edit/page.tsx`

### 2. 커스텀 렌더링

특정 필드의 표시 방식을 커스터마이징하려면:

```typescript
{
  name: 'status',
  label: '상태',
  type: 'text',
  showInList: true,
  render: (value) => (
    <Badge variant={value === 'active' ? 'default' : 'secondary'}>
      {value}
    </Badge>
  )
}
```

### 3. 검색 필드 지정

`searchableFields`에 검색 대상 필드 지정:

```typescript
searchableFields: ['name', 'email', 'description']
```

## 🐛 문제 해결

### 로그인 안 됨
- Strapi에서 해당 사용자 확인
- `.env.local` 파일 확인
- Strapi의 `/api/auth/local` 엔드포인트 확인

### CORS 에러
- Strapi의 `config/middlewares.ts`에서 CORS 설정 확인

### 빌드 에러
- `npm run build`로 에러 확인
- TypeScript 에러 수정

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Strapi v5 문서](https://docs.strapi.io)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [NextAuth.js 문서](https://next-auth.js.org)

## 📄 라이선스

MIT License

---

**개발자**: 집시세 개발팀  
**버전**: 1.0.0  
**최종 수정**: 2025-10-02