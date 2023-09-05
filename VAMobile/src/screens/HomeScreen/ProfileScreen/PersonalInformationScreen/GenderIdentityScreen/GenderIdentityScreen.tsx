import { Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, ErrorComponent, FullScreenSubtask, LoadingComponent, RadioGroup, RadioGroupProps, TextView, radioOption } from 'components'
import { Events } from 'constants/analytics'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getGenderIdentityOptions } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useDowntimeByScreenID, useRouteNavigation, useTheme } from 'utils/hooks'
import { useDemographics, useUpdateGenderIdentity } from 'api/demographics'

type GenderIdentityScreenProps = StackScreenProps<HomeStackParamList, 'GenderIdentity'>

/**
 * Screen for editing gender identity
 */
const GenderIdentityScreen: FC<GenderIdentityScreenProps> = ({ navigation }) => {
  const { genderIdentityOptions, loadingGenderIdentityOptions } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { data: demographics } = useDemographics()
  const genderIdentityMutation = useUpdateGenderIdentity()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const confirmAlert = useDestructiveActionSheet()
  const genderIdentityInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID)

  const [error, setError] = useState('')
  const [genderIdentity, setGenderIdentity] = useState(demographics?.genderIdentity)

  useEffect(() => {
    if (!Object.keys(genderIdentityOptions).length) {
      dispatch(getGenderIdentityOptions(ScreenIDTypesConstants.GENDER_IDENTITY_SCREEN_ID))
    }
  }, [dispatch, genderIdentityOptions])

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

  const onSave = (): void => {
    if (genderIdentity) {
      genderIdentityMutation.mutate(genderIdentity)
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

  if (genderIdentityMutation.isError || genderIdentityInDowntime) {
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

  if (genderIdentityMutation.isLoading) {
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
        <TextView variant="MobileBody" mb={error ? theme.dimensions.condensedMarginBetween : undefined} paragraphSpacing={error ? false : true}>
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
    </FullScreenSubtask>
  )
}

export default GenderIdentityScreen
