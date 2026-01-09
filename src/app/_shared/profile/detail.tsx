import FieldsView from '@/components/pages/SubjectDetail/profile/view';
import {
  ProfileNormalized,
  ProfileDetailDefault,
} from '@/entities/profile';
import { SubjectModes } from '@/types/common';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function ProfileEdit({ mode }: FactoryOpts) {
  return async function ProfilePage({
    params,
  }: {
    params: Promise<{ id?: string }>;
  }) {
    const { id } = await params;

    let detail: ProfileNormalized | null = null;

    if (mode === 'create') {
      detail = ProfileDetailDefault;
    } else {
      if (Number.isFinite(Number(id))) {
        let raw: any;
        try {
          raw = {} //await apiFetch(`/auth_service/profile/`);
        } catch (e: any) {
          return 'Не удалось получить данные профиля';
          throw e;
        }
        detail = raw;
      }
    }

    return (
      <FieldsView
        mode={mode}
        nameSubject="profile"
        detailData={detail as ProfileNormalized}
      />
    );
  };
}
