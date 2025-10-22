import { useMutation } from '@tanstack/react-query'

import { VeteranPassPayload, updateGooglePass } from 'api/wallet/createGooglePass'
import { walletKeys } from 'api/wallet/queryKeys'

export function useUpdateGooglePass() {
  return useMutation({
    mutationKey: walletKeys.googleUpdate,
    mutationFn: ({ id, payload }: { id: string; payload: VeteranPassPayload }) => updateGooglePass(id, payload),
    meta: { errorName: 'wallet:updateGooglePass' },
  })
}

