import { UserDTO } from '@/api/user/types';
import { useUpdateUser } from '@/features/user/useUpdateUser';
import { useUser } from '@/features/user/useUser';
import { ComponentLoader } from '@/ui/ComponentLoader';
import { Button } from '@/ui/button';
import * as F from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const USER_SETTINGS_INPUTS = [
  {
    name: 'firstName' as const,
    label: 'First Name',
  },
  {
    name: 'lastName' as const,
    label: 'Last Name',
  },
];

const userSettingsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type UserSettings = z.infer<typeof userSettingsSchema>;

export const BaseUserSettingsForm = () => {
  const { data: user, isPending: isUserPending } = useUser();

  const form = useForm<UserSettings>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
    mode: 'onChange',
  });

  const { mutate: updateMe } = useUpdateUser();

  const isFormUnchanged =
    form.watch('firstName') === user?.firstName &&
    form.watch('lastName') === user?.lastName;

  const onSubmit = (data: UserSettings) => {
    updateMe(data as Omit<UserDTO, 'email'>);
  };

  if (isUserPending) {
    return <ComponentLoader />;
  }

  return (
    <section className='w-full sm:w-2/3 md:w-1/2'>
      <h2 className='text-2xl font-bold mb-4'>Basic Info</h2>
      <F.Root formMethods={form} onSubmit={form.handleSubmit(onSubmit)}>
        {USER_SETTINGS_INPUTS.map((userSetting) => (
          <F.Field
            control={form.control}
            name={userSetting.name}
            render={({ field }) => (
              <F.Item>
                <div className='flex justify-between items-center gap-2.5 flex-wrap'>
                  <F.Label>{userSetting.label}</F.Label>
                  <F.Message />
                </div>
                <F.Control>
                  <Input {...field} />
                </F.Control>
              </F.Item>
            )}
          />
        ))}
        <Button
          type='submit'
          className='w-full text-center'
          disabled={!form.formState.isValid || isFormUnchanged}
        >
          Update Settings
        </Button>
      </F.Root>
    </section>
  );
};
