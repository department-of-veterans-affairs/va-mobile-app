import { useMutation } from '@tanstack/react-query'

import { VeteranPassPayload, createGooglePass } from 'api/wallet/createGooglePass'
import { walletKeys } from 'api/wallet/queryKeys'

export function useCreateGooglePass() {
  return useMutation({
    mutationKey: walletKeys.googleCreate,
    mutationFn: (payload: VeteranPassPayload) => createGooglePass(payload),
    meta: { errorName: 'wallet:createGooglePass' },
  })
}

