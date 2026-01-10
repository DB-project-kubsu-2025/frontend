import FieldsView from '@/components/pages/SubjectDetail/profile/view';
import { ProfileNormalized } from '@/entities/profile';
import { SubjectModes } from '@/types/common';
import { apiFetch } from '@/utils/apiFetch';

type FactoryOpts = {
  mode: SubjectModes;
  backHref?: string;
};

export function ProfileEdit({ mode }: FactoryOpts) {
  return async function ProfilePage() {
    try {
      const detail = (await apiFetch(`/employees/user-info/`)).data;
      console.log(detail);
      return (
        <FieldsView
          mode={mode}
          nameSubject="profile"
          detailData={detail as ProfileNormalized}
        />
      );
    } catch (e: any) {
      return 'Не удалось получить данные профиля';
      throw e;
    }
  };
}
