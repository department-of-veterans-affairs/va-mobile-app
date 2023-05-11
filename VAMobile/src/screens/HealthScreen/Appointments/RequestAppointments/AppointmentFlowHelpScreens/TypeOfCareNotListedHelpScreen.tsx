import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useLayoutEffect } from 'react'

import { ALWAYS_SHOW_CARE_LIST, TYPE_OF_CARE } from 'store/api/types'
import { Box, TextView, VABulletList } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState } from 'store/slices'
import { RootState } from 'store'
import { useRequestAppointmentModalHeaderStyles } from 'utils/requestAppointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type TypeOfCareNotListedHelpScreenProps = StackScreenProps<HealthStackParamList, 'TypeOfCareNotListedHelpScreen'>

/** Component to show the non eligible type of care help screen  */
const TypeOfCareNotListedHelpScreen: FC<TypeOfCareNotListedHelpScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const { gutter, contentMarginTop, condensedMarginBetween, standardMarginBetween } = theme?.dimensions?
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: tc('webview.vagov'), loadingMessage: tc('webview.valocation.loading') })

  const headerStyle = useRequestAppointmentModalHeaderStyles()
  const { vaEligibleTypeOfCares } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
    })
  }, [navigation, headerStyle])

  const getNonEligibleCare = () => {
    TYPE_OF_CARE.sort((a, b) => {
      return a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    })

    // gets the type of care the user is not eligible for and are not in the list of always shown
    const nonEligibleCares = TYPE_OF_CARE.filter((care) => {
      const careItem = vaEligibleTypeOfCares.find((item) => item.name === care.idV2)
      // if it is not one of the always show care and has no facility in the request and direct eligibility list
      return (
        !ALWAYS_SHOW_CARE_LIST.includes(care.idV2) && (!careItem || (careItem && careItem.requestEligibleFacilities.length === 0 && careItem.directEligibleFacilities.length === 0))
      )
    })

    const bulletedListOfText = []

    for (const care of nonEligibleCares) {
      bulletedListOfText.push({ text: care.name })
    }

    return (
      <Box mx={gutter}>
        <VABulletList listOfText={bulletedListOfText} />
      </Box>
    )
  }

  return (
    <Box flex={1} backgroundColor={'main'}>
      <Box mx={gutter}>
        <TextView variant="MobileBodyBold" mt={contentMarginTop} accessibilityRole="header">
          {t('requestAppointment.typeOfCareNotListedCallToSchedule')}
        </TextView>
        <TextView variant="MobileBody" mt={condensedMarginBetween} accessibilityLabel={t('requestAppointment.typeOfCareNotListedYoureNotLabel')}>
          {t('requestAppointment.typeOfCareNotListedYoureNotDesc')}
        </TextView>
        {getNonEligibleCare()}
        <TextView variant="MobileBody" mt={standardMarginBetween} accessibilityLabel={t('requestAppointment.typeOfCareNotListedForTheseTypeOfCareLabel')}>
          {t('requestAppointment.typeOfCareNotListedForTheseTypeOfCareDesc')}
        </TextView>
        <TextView
          mt={condensedMarginBetween}
          variant="MobileBodyLink"
          accessibilityLabel={t('requestAppointment.typeOfCareNotListedFindfVaLinkLabel')}
          onPress={() => {
            navigation.goBack()
            onFacilityLocator()
          }}>
          {t('requestAppointment.typeOfCareNotListedFindfVaLinkTitle')}
        </TextView>
      </Box>
    </Box>
  )
}

export default TypeOfCareNotListedHelpScreen
