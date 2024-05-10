import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useDemographics } from 'api/demographics/getDemographics'
import { useGenderIdentityOptions } from 'api/demographics/getGenderIdentityOptions'
import { useUpdateGenderIdentity } from 'api/demographics/updateGenderIdentity'
import {
  Box,
  ErrorComponent,
  FullScreenSubtask,
  LoadingComponent,
  RadioGroup,
  RadioGroupProps,
  TextView,
  radioOption,
} from 'components'
import { SnackbarMessages } from 'components/SnackBar'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { showSnackBar } from 'utils/common'
import {
  useAppDispatch,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useDowntimeByScreenID,
  useRouteNavigation,
  useTheme,
} from 'utils/hooks'

type GenderIdentityScreenProps = StackScreenProps<HomeStackParamList, 'GenderIdentity'>

/**
 * Screen for editing gender identity
 */
function GenderIdentityScreen({ navigation }: GenderIdentityScreenProps) {
  const {
    data: demographics,
    error: getDemographicsError,
    refetch: refetchDemographics,
    isFetching: loadingDemographics,
  } = useDemographics()
  const {
    data: genderIdentityOptions,
    isFetching: loadingGenderIdentityOptions,
    error: getGenderIdentityOptionsError,
    refetch: refetchGenderIdentityOptions,
  } = useGenderIdentityOptions()
  const genderIdentityMutation = useUpdateGenderIdentity()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const confirmAlert = useDestructiveActionSheet()
  const genderIdentityInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID)

  const [error, setError] = useState('')
  const [genderIdentity, setGenderIdentity] = useState(demographics?.genderIdentity)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.genderIdentity.saved'),
    errorMsg: t('personalInformation.genderIdentity.not.saved'),
  }

  useEffect(() => {
    if (genderIdentityMutation.isSuccess) {
      navigation.goBack()
    }
  }, [genderIdentityMutation.isSuccess, navigation])

  useBeforeNavBackListener(navigation, (e) => {
    if (demographics?.genderIdentity === genderIdentity || !genderIdentity) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('personalInformation.genderIdentity.deleteChange'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('deleteChanges'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const onChange = (value: string): void => {
    setGenderIdentity(value)
  }

  const updateGenderIdentity = () => {
    if (genderIdentity) {
      const mutateOptions = {
        onSuccess: () => showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true),
        onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, updateGenderIdentity, false, true, true),
      }
      genderIdentityMutation.mutate(genderIdentity, mutateOptions)
    }
  }

  const onSave = (): void => {
    if (genderIdentity) {
      updateGenderIdentity()
    } else {
      setError(t('selectOption'))
    }
  }

  const getIdentityTypes = (): Array<radioOption<string>> => {
    if (!genderIdentityOptions) {
      return []
    }

    return Object.keys(genderIdentityOptions).map((key: string) => {
      return {
        labelKey: genderIdentityOptions[key],
        value: key,
      }
    })
  }

  const goToHelp = (): void => {
    logAnalyticsEvent(Events.vama_gender_id_help)
    navigateTo('WhatToKnow')
  }

  const radioGroupProps: RadioGroupProps<string> = {
    error,
    isRadioList: false,
    onChange,
    options: getIdentityTypes(),
    value: genderIdentity,
  }

  const onTryAgain = () => {
    if (getDemographicsError) {
      refetchDemographics()
    }
    if (getGenderIdentityOptionsError) {
      refetchGenderIdentityOptions()
    }
  }

  const errorCheck = genderIdentityInDowntime || getDemographicsError || getGenderIdentityOptionsError
  const loadingCheck = loadingGenderIdentityOptions || genderIdentityMutation.isPending || loadingDemographics

  return (
    <FullScreenSubtask
      title={t('personalInformation.genderIdentity.title')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      primaryContentButtonText={errorCheck || loadingCheck ? undefined : t('save')}
      onPrimaryContentButtonPress={onSave}
      testID="PersonalInformationTestID">
      {loadingCheck ? (
        <LoadingComponent
          text={
            loadingGenderIdentityOptions || loadingDemographics
              ? t('personalInformation.genderIdentity.loading')
              : t('personalInformation.genderIdentity.saving')
          }
        />
      ) : errorCheck ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID}
          onTryAgain={onTryAgain}
          error={getDemographicsError || getGenderIdentityOptionsError}
        />
      ) : (
        <Box mx={theme.dimensions.gutter}>
          <TextView
            variant="MobileBody"
            mb={error ? theme.dimensions.condensedMarginBetween : undefined}
            paragraphSpacing={error ? false : true}>
            {t('personalInformation.genderIdentity.changeSelection')}
            <TextView variant="MobileBodyBold">{t('personalInformation.genderIdentity.preferNotToAnswer')}</TextView>
            <TextView variant="MobileBody">.</TextView>
          </TextView>
          <RadioGroup {...radioGroupProps} />
          <Pressable onPress={goToHelp} accessibilityRole="link" accessible={true}>
            <TextView variant="MobileBodyLink" paragraphSpacing={true}>
              {t('personalInformation.genderIdentity.whatToKnow')}
            </TextView>
          </Pressable>
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default GenderIdentityScreen
