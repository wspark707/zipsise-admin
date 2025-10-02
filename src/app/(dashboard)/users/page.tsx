'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/crud/data-table';
import strapiClient from '@/lib/strapi';
import { Plus, Trash2 } from 'lucide-react';
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

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    pageCount: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: '사용자명' },
    { key: 'email', label: '이메일' },
    { 
      key: 'confirmed', 
      label: '이메일 인증',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
        }`}>
          {value ? '인증됨' : '미인증'}
        </span>
      )
    },
    { 
      key: 'blocked', 
      label: '차단 상태',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
        }`}>
          {value ? '차단됨' : '정상'}
        </span>
      )
    },
    { key: 'createdAt', label: '생성일' },
  ];

  const fetchUsers = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params: any = {
        pagination: {
          page,
          pageSize: pagination.pageSize,
          withCount: true,
        },
        sort: ['createdAt:desc'],
      };

      if (search) {
        params.filters = {
          $or: [
            { username: { $containsi: search } },
            { email: { $containsi: search } },
          ],
        };
      }

      const response = await strapiClient.getCollection('users', params);
      
      setUsers(response.data);
      if (response.meta?.pagination) {
        setPagination(response.meta.pagination);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: '오류',
        description: '사용자 목록을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = (query: string) => {
    fetchUsers(1, query);
  };

  const handleView = (user: any) => {
    router.push(`/users/${user.documentId || user.id}`);
  };

  const handleEdit = (user: any) => {
    router.push(`/users/${user.documentId || user.id}/edit`);
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await strapiClient.deleteDocument('users', selectedUser.documentId || selectedUser.id);
      
      toast({
        title: '성공',
        description: '사용자가 삭제되었습니다.',
      });
      
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      fetchUsers(pagination.page);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: '오류',
        description: '사용자 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            사용자 관리
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            전체 사용자 목록을 관리합니다
          </p>
        </div>
        <Button onClick={() => router.push('/users/create')}>
          <Plus className="h-4 w-4 mr-2" />
          새 사용자
        </Button>
      </div>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
          <CardDescription>
            전체 {pagination.total}명의 사용자
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={users}
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
              사용자 "{selectedUser?.username}"을(를) 삭제하시겠습니까?
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