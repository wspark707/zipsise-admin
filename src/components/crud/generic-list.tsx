'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/crud/data-table';
import strapiClient from '@/lib/strapi';
import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { CollectionConfig } from '@/types';

interface GenericListProps {
  config: CollectionConfig;
}

export default function GenericList({ config }: GenericListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: config.itemsPerPage || 10,
    total: 0,
    pageCount: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 아이콘 동적 로딩
  const Icon = config.icon ? (Icons as any)[config.icon] : null;

  // 테이블 컬럼 생성
  const columns = config.fields
    .filter(field => field.showInList)
    .map(field => ({
      key: field.name,
      label: field.label,
      sortable: true,
      render: field.type === 'boolean' 
        ? (value: boolean) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {value ? '예' : '아니오'}
            </span>
          )
        : undefined,
    }));

  const fetchItems = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params: any = {
        pagination: {
          page,
          pageSize: pagination.pageSize,
          withCount: true,
        },
        sort: [config.defaultSort || 'createdAt:desc'],
      };

      if (search && config.searchableFields) {
        params.filters = {
          $or: config.searchableFields.map(field => ({
            [field]: { $containsi: search },
          })),
        };
      }

      const response = await strapiClient.getCollection(config.name, params);
      
      setItems(response.data);
      if (response.meta?.pagination) {
        setPagination(response.meta.pagination);
      }
    } catch (error: any) {
      console.error(`Error fetching ${config.name}:`, error);
      toast({
        title: '오류',
        description: `${config.displayName} 목록을 불러오는데 실패했습니다.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePageChange = (page: number) => {
    fetchItems(page);
  };

  const handleSearch = (query: string) => {
    fetchItems(1, query);
  };

  const handleView = (item: any) => {
    router.push(`/${config.name}/${item.documentId || item.id}`);
  };

  const handleEdit = (item: any) => {
    router.push(`/${config.name}/${item.documentId || item.id}/edit`);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;

    try {
      await strapiClient.deleteDocument(config.name, selectedItem.documentId || selectedItem.id);
      
      toast({
        title: '성공',
        description: `${config.displayName}이(가) 삭제되었습니다.`,
      });
      
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      fetchItems(pagination.page);
    } catch (error: any) {
      console.error(`Error deleting ${config.name}:`, error);
      toast({
        title: '오류',
        description: `${config.displayName} 삭제에 실패했습니다.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {config.displayName} 관리
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {config.description}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/${config.name}/create`)}>
          <Plus className="h-4 w-4 mr-2" />
          새로 만들기
        </Button>
      </div>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>{config.displayName} 목록</CardTitle>
          <CardDescription>
            전체 {pagination.total}개의 {config.displayName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={items}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 {config.displayName}을(를) 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}