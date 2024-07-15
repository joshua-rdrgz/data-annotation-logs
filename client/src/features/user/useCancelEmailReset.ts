import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelEmailReset } from '@/api/user/cancelEmailReset';
import { QueryKeys } from '@/config/QueryKeys';
import { toast } from 'react-hot-toast';

export const useCancelEmailReset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelEmailReset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER] });
      toast.success('Email change cancelled successfully');
    },
    onError: (error: Error) => {
      console.error('Error cancelling email change:', error);
      toast.error(error.message || 'Failed to cancel email change');
    },
  });
};
