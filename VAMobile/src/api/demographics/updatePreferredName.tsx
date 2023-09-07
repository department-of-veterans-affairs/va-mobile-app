import { useMutation, useQueryClient } from '@tanstack/react-query'

import { EditResponseData, put } from 'store/api'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { SnackbarMessages } from 'components/SnackBar'
import { isErrorObject, showSnackBar } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useAppDispatch } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

/**
 * Updates a user's preferred name
 */
export const updatePreferredName = async (preferredName: string) => {
  try {
    const preferredNameUpdateData = {
      text: preferredName,
    }
    await put<EditResponseData>('/v0/user/preferred_name', preferredNameUpdateData)
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for updating preferred name
 */
export const useUpdatePreferredName = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.preferredName.saved'),
    errorMsg: t('personalInformation.preferredName.notSaved'),
  }

  return useMutation({
    mutationFn: updatePreferredName,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_preferred_name())
      await logAnalyticsEvent(Events.vama_pref_name_success)
      queryClient.invalidateQueries({ queryKey: ['user', 'demographics'] })
      showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false)
    },
    onError: async (data: string, error) => {
      if (isErrorObject(error)) {
        const retryFunction = () => updatePreferredName(data)
        logNonFatalErrorToFirebase(error, 'updatePreferredName: Service error')
        showSnackBar(snackbarMessages.errorMsg, dispatch, retryFunction, false, true, true)
      }
      await logAnalyticsEvent(Events.vama_pref_name_fail)
    },
  })
}
