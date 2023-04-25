import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, ErrorComponent, FullScreenSubtask, LoadingComponent, RadioGroup, RadioGroupProps, TextView, radioOption } from 'components'
import { Events } from 'constants/analytics'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, dispatchFinishEditGenderIdentity, getGenderIdentityOptions, updateGenderIdentity } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'

type GenderIdentityScreenProps = StackScreenProps<HomeStackParamList, 'GenderIdentity'>

/**
 * Screen for editing gender identity
 */
const GenderIdentityScreen: FC<GenderIdentityScreenProps> = ({ navigation }) => {
  const { profile, genderIdentityOptions, genderIdentitySaved, loading, loadingGenderIdentityOptions } = useSelector<RootState, PersonalInformationState>(
    (state) => state.personalInformation,
  )
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const [error, setError] = useState('')
  const [genderIdentity, setGenderIdentity] = useState(profile?.genderIdentity)

  useEffect(() => {
    if (!Object.keys(genderIdentityOptions).length) {
      dispatch(getGenderIdentityOptions(ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID))
    }
  }, [dispatch, genderIdentityOptions])

  useEffect(() => {
    if (genderIdentitySaved) {
      dispatch(dispatchFinishEditGenderIdentity())
      navigation.goBack()
    }
  }, [genderIdentitySaved, navigation, dispatch])

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.genderIdentity.saved'),
    errorMsg: t('personalInformation.genderIdentity.not.saved'),
  }

  const onChange = (value: string): void => {
    setGenderIdentity(value)
  }

  const onSave = (): void => {
    if (genderIdentity) {
      dispatch(updateGenderIdentity(genderIdentity, snackbarMessages, ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID))
    } else {
      setError(t('selectOption'))
    }
  }

  const getIdentityTypes = (): Array<radioOption<string>> => {
    return Object.keys(genderIdentityOptions).map((key: string) => {
      return {
        labelKey: genderIdentityOptions[key],
        value: key,
      }
    })
  }

  const goToHelp = (): void => {
    logAnalyticsEvent(Events.vama_gender_id_help)
    navigateTo('WhatToKnow')()
  }
  
  const radioGroupProps: RadioGroupProps<string> = {
    error,
    isRadioList: false,
    onChange,
    options: getIdentityTypes(),
    value: genderIdentity,
  }

  if (useError(ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID)) {
    return (
      <FullScreenSubtask title={t('personalInformation.genderIdentity.title')} leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <ErrorComponent screenID={ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if (loadingGenderIdentityOptions) {
    return (
      <FullScreenSubtask title={t('personalInformation.genderIdentity.title')} leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={t('personalInformation.genderIdentity.loading')} />
      </FullScreenSubtask>
    )
  }

  if (loading || genderIdentitySaved) {
    return (
      <FullScreenSubtask title={t('personalInformation.genderIdentity.title')} leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={t('personalInformation.genderIdentity.saving')} />
      </FullScreenSubtask>
    )
  }

  return (
    <FullScreenSubtask
      title={t('personalInformation.genderIdentity.title')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      primaryContentButtonText={t('save')}
      onPrimaryContentButtonPress={onSave}>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant="MobileBody" mb={error ? theme.dimensions.condensedMarginBetween : theme.dimensions.standardMarginBetween}>
          {t('personalInformation.genderIdentity.changeSelection')}
          <TextView variant="MobileBodyBold">{t('personalInformation.genderIdentity.preferNotToAnswer')}</TextView>
        </TextView>
        <RadioGroup {...radioGroupProps} />
        <Pressable onPress={goToHelp} accessibilityRole="link" accessible={true}>
          <TextView variant="MobileBodyLink">{t('personalInformation.genderIdentity.whatToKnow')}</TextView>
        </Pressable>
      </Box>
    </FullScreenSubtask>
  )
}

export default GenderIdentityScreen
