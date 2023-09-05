import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DemographicsPayload, UserDemographics } from './types/DemographicsData'
import { EditResponseData, get, put } from '../store/api'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { SnackbarMessages } from 'components/SnackBar'
import { isErrorObject, showSnackBar } from 'utils/common'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import { useAppDispatch } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

/**
 * Fetch user demographics
 */
export const getDemographics = async (): Promise<UserDemographics | undefined> => {
  try {
    const response = await get<DemographicsPayload>('/v0/user/demographics')
    return response?.data.attributes
  } catch (error) {
    if (isErrorObject(error)) {
      logNonFatalErrorToFirebase(error, 'getDemographics: Service error')
    }
    throw error
  }
}

/**
 * Returns a query for user demographics
 */
export const useDemographics = () => {
  return useQuery({
    queryKey: ['user', 'demographics'],
    queryFn: () => getDemographics(),
  })
}

/**
 * Updates gender identity
 */
export const updateGenderIdentity = async (genderIdentity: string) => {
  try {
    await put<EditResponseData>('/v0/user/gender_identity', { code: genderIdentity })
  } catch (error) {
    throw error
  }
}

/**
 * Returns a mutation for updating gender identity
 */
export const useUpdateGenderIdentity = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.genderIdentity.saved'),
    errorMsg: t('personalInformation.genderIdentity.not.saved'),
  }

  return useMutation({
    mutationFn: updateGenderIdentity,
    onSuccess: async () => {
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      await logAnalyticsEvent(Events.vama_gender_id_success)
      queryClient.invalidateQueries({ queryKey: ['user', 'demographics'] })
      showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true)
    },
    onError: async (data: string, error) => {
      if (isErrorObject(error)) {
        const retryFunction = () => updateGenderIdentity(data)
        logNonFatalErrorToFirebase(error, 'updateGenderIdentity: Service error')
        showSnackBar(snackbarMessages.errorMsg, dispatch, retryFunction, false, true, true)
      }
      await logAnalyticsEvent(Events.vama_gender_id_fail)
    },
  })
}
