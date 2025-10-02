'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import strapiClient from '@/lib/strapi';
import { ArrowLeft, Edit, Trash2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
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

export default function AptEnergyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [aptEnergy, setAptEnergy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchAptEnergy();
  }, [resolvedParams.id]);

  const fetchAptEnergy = async () => {
    try {
      setLoading(true);
      const response = await strapiClient.getDocument('cm-apt-energies', resolvedParams.id);
      setAptEnergy(response.data);
    } catch (error: any) {
      console.error('Error fetching apt energy:', error);
      toast({
        title: '오류',
        description: '아파트 에너지 정보를 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await strapiClient.deleteDocument('cm-apt-energies', resolvedParams.id);
      
      toast({
        title: '성공',
        description: '아파트 에너지 정보가 삭제되었습니다.',
      });
      
      router.push('/cm-apt-energies');
    } catch (error: any) {
      console.error('Error deleting apt energy:', error);
      toast({
        title: '오류',
        description: '아파트 에너지 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!aptEnergy) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">아파트 에너지 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              아파트 에너지 상세정보
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {aptEnergy.aen_apt_code} - {aptEnergy.aen_ym}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/cm-apt-energies/${resolvedParams.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            수정
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            삭제
          </Button>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ID</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">{aptEnergy.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Document ID</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">{aptEnergy.documentId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">아파트코드</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">{aptEnergy.aen_apt_code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">년월</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">{aptEnergy.aen_ym}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 에너지 사용량 */}
      <Card>
        <CardHeader>
          <CardTitle>에너지 사용량</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">난방비</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {aptEnergy.aen_heat ? `${aptEnergy.aen_heat.toLocaleString()}원` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">급탕비</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {aptEnergy.aen_water_hot ? `${aptEnergy.aen_water_hot.toLocaleString()}원` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">가스비</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {aptEnergy.aen_gas ? `${aptEnergy.aen_gas.toLocaleString()}원` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">전기료</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {aptEnergy.aen_elect ? `${aptEnergy.aen_elect.toLocaleString()}원` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">생성일</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {format(new Date(aptEnergy.createdAt), 'PPP', { locale: ko })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">수정일</p>
              <p className="text-base text-slate-900 dark:text-white mt-1">
                {format(new Date(aptEnergy.updatedAt), 'PPP', { locale: ko })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 아파트 에너지 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}