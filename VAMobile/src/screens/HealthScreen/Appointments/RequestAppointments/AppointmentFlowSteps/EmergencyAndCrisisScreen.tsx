import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'

type EmergencyAndCrisisScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'EmergencyAndCrisisScreen'>

const EmergencyAndCrisisScreen: FC<EmergencyAndCrisisScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const launchExternalLink = useExternalLink()

  const navigateToCrisisLine = navigateTo('VeteransCrisisLine')

  const onCrisisLinePressed = () => {
    navigation.getParent()?.goBack()
    navigateToCrisisLine()
  }

  const on911Pressed = () => {
    navigation.getParent()?.goBack()
    const open911 = 'tel:911'
    launchExternalLink(open911)
  }

  return (
    <AppointmentFlowLayout firstActionButtonPress={navigateTo('TypeOfCareSelectionScreen')} firstActionButtonTitle={t('requestAppointment.continueToRequestBtn')}>
      <Box justifyContent="center" flex={1}>
        <AppointmentFlowTitleSection title={t('requestAppointment.doYouNeedHelpRightNow')} titleMarginBottom={theme?.dimensions?.standardMarginBetween} />
        <TextView mx={theme?.dimensions?.gutter} mb={theme?.dimensions?.condensedMarginBetween} accessibilityLabel={t('requestAppointment.lifeOrHealthInDangerLabel')}>
          {t('requestAppointment.lifeOrHealthInDangerText')}
        </TextView>
        <AppointmentFlowWhiteCtaButton
          mx={10}
          onPress={on911Pressed}
          text={t('requestAppointments.call911BtnTitle')}
          label={t('requestAppointments.call911Btnlabel')}
          hint={t('requestAppointments.call911BtnHint')}
        />
        <TextView mx={theme?.dimensions?.gutter} mb={theme?.dimensions?.condensedMarginBetween}>
          {t('requestAppointment.ifYouAreInCrisisText')}
        </TextView>
        <AppointmentFlowWhiteCtaButton
          mx={10}
          onPress={onCrisisLinePressed}
          text={`${th('component.crisisLine.talkToThe')} ${th('component.crisisLine.veteranCrisisLine')} ${th('component.crisisLine.now')}`}
        />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default EmergencyAndCrisisScreen
