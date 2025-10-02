// src/lib/collection-config.ts
import { 
  Building2, 
  Home, 
  TrendingUp, 
  MapPin, 
  DollarSign,
  FileText,
  Map,
  School,
  Warehouse
} from 'lucide-react';
import type { CollectionConfig } from '@/types';

export const collections: Record<string, CollectionConfig> = {
  // ========== 아파트 관리 ==========
  'cm-apt-lists': {
    name: 'cm-apt-lists',
    displayName: '아파트 목록',
    icon: 'Building2',
    description: '전국 아파트 기본 정보',
    searchableFields: ['apt_name', 'apt_code', 'apt_addr'],
    defaultSort: 'createdAt:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'apt_code', label: '아파트코드', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_name', label: '아파트명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_addr', label: '주소', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_household_cnt', label: '세대수', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_dong_cnt', label: '동수', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_use_date', label: '사용승인일', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'apt_b_company', label: '건설사', type: 'text', showInList: false, showInForm: true, showInDetail: true },
      { name: 'apt_tel', label: '전화번호', type: 'text', showInList: false, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  'cm-apt-energies': {
    name: 'cm-apt-energies',
    displayName: '아파트 에너지',
    icon: 'TrendingUp',
    description: '아파트 에너지 사용량 정보',
    searchableFields: ['aen_apt_code'],
    defaultSort: 'aen_ym:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'aen_apt_code', label: '아파트코드', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'aen_ym', label: '년월', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'aen_heat', label: '난방비', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'aen_water_hot', label: '급탕비', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'aen_gas', label: '가스비', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'aen_elect', label: '전기료', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  // ========== 거래 정보 ==========
  'cm-trade-sales-apts': {
    name: 'cm-trade-sales-apts',
    displayName: '아파트 매매',
    icon: 'DollarSign',
    description: '아파트 매매 거래 정보',
    searchableFields: ['sales_apt_name', 'sales_apt_umd_name'],
    defaultSort: 'sales_apt_deal_ymd:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'sales_apt_name', label: '아파트명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_umd_name', label: '읍면동', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_jibun', label: '지번', type: 'text', showInList: false, showInForm: true, showInDetail: true },
      { name: 'sales_apt_use_area', label: '전용면적', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_deal_ymd', label: '거래일', type: 'date', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_deal_amount', label: '거래금액', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_floor', label: '층', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sales_apt_build_year', label: '건축년도', type: 'text', showInList: false, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  'cm-trade-rent-apts': {
    name: 'cm-trade-rent-apts',
    displayName: '아파트 전월세',
    icon: 'Home',
    description: '아파트 전월세 거래 정보',
    searchableFields: ['rent_apt_name', 'rent_apt_umd_name'],
    defaultSort: 'rent_apt_deal_ymd:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'rent_apt_name', label: '아파트명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_umd_name', label: '읍면동', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_use_area', label: '전용면적', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_deal_ymd', label: '거래일', type: 'date', showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_deposit', label: '보증금', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_monthly_rent', label: '월세', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'rent_apt_floor', label: '층', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  // ========== 지역 정보 ==========
  'cm-region-sidos': {
    name: 'cm-region-sidos',
    displayName: '시도',
    icon: 'Map',
    description: '시도 정보',
    searchableFields: ['sido_name', 'sido_code'],
    defaultSort: 'sido_code:asc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'sido_code', label: '시도코드', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'sido_name', label: '시도명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  'cm-region-sggs': {
    name: 'cm-region-sggs',
    displayName: '시군구',
    icon: 'MapPin',
    description: '시군구 정보',
    searchableFields: ['sgg_name', 'sgg_code'],
    defaultSort: 'sgg_code:asc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'sgg_code', label: '시군구코드', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'sgg_name', label: '시군구명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'sido_code', label: '시도코드', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  // ========== 건물/토지 정보 ==========
  'cm-pnu-buildings': {
    name: 'cm-pnu-buildings',
    displayName: 'PNU 건물',
    icon: 'Warehouse',
    description: 'PNU 기반 건물 정보',
    searchableFields: ['bld_pnu', 'bld_buld_name'],
    defaultSort: 'createdAt:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'bld_pnu', label: 'PNU', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'bld_buld_name', label: '건물명', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'bld_buld_knd_code_name', label: '건물종류', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'bld_ground_floor_co', label: '지상층수', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'bld_undgrnd_floor_co', label: '지하층수', type: 'number', showInList: true, showInForm: true, showInDetail: true },
      { name: 'bld_use_confm_de', label: '사용승인일', type: 'date', showInList: true, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },

  'cm-school-infos': {
    name: 'cm-school-infos',
    displayName: '학교 정보',
    icon: 'School',
    description: '전국 학교 정보',
    searchableFields: ['sch_schul_nm', 'sch_org_rdnma'],
    defaultSort: 'createdAt:desc',
    itemsPerPage: 20,
    fields: [
      { name: 'id', label: 'ID', type: 'number', showInList: true, showInForm: false, showInDetail: true },
      { name: 'sch_schul_nm', label: '학교명', type: 'text', required: true, showInList: true, showInForm: true, showInDetail: true },
      { name: 'sch_schul_knd_sc_nm', label: '학교종류', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sch_org_rdnma', label: '주소', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sch_org_telno', label: '전화번호', type: 'text', showInList: true, showInForm: true, showInDetail: true },
      { name: 'sch_hmpg_adres', label: '홈페이지', type: 'text', showInList: false, showInForm: true, showInDetail: true },
      { name: 'sch_fond_ymd', label: '개교일', type: 'date', showInList: false, showInForm: true, showInDetail: true },
      { name: 'createdAt', label: '생성일', type: 'datetime', showInList: true, showInForm: false, showInDetail: true },
    ],
  },
};

export function getCollections(): CollectionConfig[] {
  return Object.values(collections);
}

export function getCollectionConfig(name: string): CollectionConfig | undefined {
  return collections[name];
}

export function hasCollection(name: string): boolean {
  return name in collections;
}