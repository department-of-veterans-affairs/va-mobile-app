import { useMutation } from '@tanstack/react-query'

import { VeteranPassPayload, createApplePkpassBase64 } from 'api/wallet/createApplePkpassBase64'
import { walletKeys } from 'api/wallet/queryKeys'

export function useCreateApplePass() {
  return useMutation({
    mutationKey: walletKeys.apple,
    mutationFn: (payload: VeteranPassPayload) => createApplePkpassBase64(payload),
    meta: { errorName: 'wallet:createApplePass' },
  })
}
