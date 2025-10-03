'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import strapiClient from '@/lib/strapi';
import { ArrowLeft, Save } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { CollectionConfig, FieldConfig } from '@/types';

interface GenericFormProps {
  config: CollectionConfig;
  documentId?: string;
  mode: 'create' | 'edit';
}

export default function GenericForm({ config, documentId, mode }: GenericFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 아이콘 동적 로딩
  const Icon = config.icon ? (Icons as any)[config.icon] : null;

  // 초기 데이터 로드 (수정 모드)
  useEffect(() => {
    if (mode === 'edit' && documentId) {
      fetchData();
    } else {
      // 기본값 설정
      const initialData: Record<string, any> = {};
      config.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.name] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  }, [documentId, mode]);

  const fetchData = async () => {
    if (!documentId) return;

    try {
      setInitialLoading(true);
      const response = await strapiClient.getDocument(config.name, documentId);
      setFormData(response.data);
    } catch (error: any) {
      console.error(`Error fetching ${config.name}:`, error);
      toast({
        title: '오류',
        description: `데이터를 불러오는데 실패했습니다.`,
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach(field => {
      if (!field.showInForm) return;

      const value = formData[field.name];

      // 필수 필드 체크
      if (field.required && !value) {
        newErrors[field.name] = `${field.label}을(를) 입력해주세요`;
        return;
      }

      // 이메일 검증
      if (field.type === 'email' && value) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field.name] = '올바른 이메일 형식이 아닙니다';
        }
      }

      // 길이 검증
      if (field.validation) {
        if (field.validation.minLength && value && value.length < field.validation.minLength) {
          newErrors[field.name] = `최소 ${field.validation.minLength}자 이상 입력해주세요`;
        }
        if (field.validation.maxLength && value && value.length > field.validation.maxLength) {
          newErrors[field.name] = `최대 ${field.validation.maxLength}자까지 입력 가능합니다`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (mode === 'create') {
        await strapiClient.createDocument(config.name, formData);
        toast({
          title: '성공',
          description: `${config.displayName}이(가) 생성되었습니다.`,
        });
      } else if (documentId) {
        // 🔥 핵심 수정: 시스템 필드 제외하고 전송
        const updateData: Record<string, any> = {};
        
        // 제외할 시스템 필드 목록
        const systemFields = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt', 'locale'];
        
        config.fields.forEach(field => {
          // showInForm이 true이고, 시스템 필드가 아니며, 값이 있는 경우만 포함
          if (
            field.showInForm && 
            !systemFields.includes(field.name) && 
            formData[field.name] !== undefined
          ) {
            updateData[field.name] = formData[field.name];
          }
        });

        console.log('Update data to send:', updateData);
        
        await strapiClient.updateDocument(config.name, documentId, updateData);
        toast({
          title: '성공',
          description: `${config.displayName}이(가) 수정되었습니다.`,
        });
      }

      router.push(`/${config.name}`);
    } catch (error: any) {
      console.error(`Error saving ${config.name}:`, error);
      toast({
        title: '오류',
        description: error.response?.data?.error?.message || `저장에 실패했습니다.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const renderField = (field: FieldConfig) => {
    if (!field.showInForm) return null;

    const value = formData[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {field.helpText && (
              <p className="text-sm text-slate-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'textarea':
      case 'richtext':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={field.type === 'richtext' ? 10 : 4}
              className={error ? 'border-red-500' : ''}
            />
            {field.helpText && (
              <p className="text-sm text-slate-500">{field.helpText}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      case 'boolean':
        return (
          <div key={field.name} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.helpText && (
                <p className="text-sm text-slate-500">{field.helpText}</p>
              )}
            </div>
            <Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => handleChange(field.name, checked)}
            />
          </div>
        );

      case 'date':
      case 'datetime':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'datetime' ? 'datetime-local' : 'date'}
              value={value ? new Date(value).toISOString().slice(0, field.type === 'datetime' ? 16 : 10) : ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        {Icon && (
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {mode === 'create' ? `새 ${config.displayName} 만들기` : `${config.displayName} 수정`}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {config.description}
          </p>
        </div>
      </div>

      {/* 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>{config.displayName} 정보</CardTitle>
          <CardDescription>필수 정보를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map(renderField)}

            {/* 버튼 */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}