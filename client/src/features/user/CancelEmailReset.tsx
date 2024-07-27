import React from 'react';
import { useCancelEmailReset } from './useCancelEmailReset';
import { useUser } from './useUser';
import * as AD from '@/ui/alert-dialog';
import { Button } from '@/ui/button';
import {
  CancelEmailResetTestIds,
  UserEmailSettingsFormTestIds,
} from './testIds';
import { WarningBox } from '@/ui/WarningBox';

interface CancelEmailResetProps {
  onCancelSuccess: () => void;
}

export const CancelEmailReset: React.FC<CancelEmailResetProps> = ({
  onCancelSuccess,
}) => {
  const { data: user } = useUser();
  const { mutate: cancelEmailReset } = useCancelEmailReset();

  if (!user?.pendingEmailChange) return null;

  const handleCancelEmailReset = () => {
    cancelEmailReset(undefined, {
      onSuccess: () => {
        onCancelSuccess();
      },
    });
  };

  return (
    <WarningBox
      data-testid={UserEmailSettingsFormTestIds.PendingEmailChangeNotification}
    >
      Please verify the new email address{' '}
      {user.pendingEmail && (
        <>
          (<strong>{user.pendingEmail}</strong>)
        </>
      )}{' '}
      before attempting another change.
      <AD.Root>
        <AD.Trigger asChild>
          <Button
            variant='link'
            className='p-0 h-auto font-normal text-yellow-800 hover:text-yellow-900'
            wrapperClassName='inline ml-3'
            data-testid={CancelEmailResetTestIds.CancelEmailChangeButton}
          >
            Need to cancel?
          </Button>
        </AD.Trigger>
        <AD.Content
          data-testid={CancelEmailResetTestIds.CancelEmailChangeDialog}
        >
          <AD.Header>
            <AD.Title>Cancel Email Change</AD.Title>
            <AD.Description>
              Are you sure you want to cancel the pending email change? This
              action cannot be undone.
            </AD.Description>
          </AD.Header>
          <AD.Footer>
            <AD.Cancel
              data-testid={
                CancelEmailResetTestIds.CancelCancelEmailChangeButton
              }
            >
              No, keep it
            </AD.Cancel>
            <AD.Action
              onClick={handleCancelEmailReset}
              data-testid={
                CancelEmailResetTestIds.ConfirmCancelEmailChangeButton
              }
            >
              Yes, cancel it
            </AD.Action>
          </AD.Footer>
        </AD.Content>
      </AD.Root>
    </WarningBox>
  );
};
