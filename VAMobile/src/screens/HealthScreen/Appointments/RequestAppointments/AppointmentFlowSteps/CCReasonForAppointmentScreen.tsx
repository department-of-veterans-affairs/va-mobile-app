import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type CCReasonForAppointmentScreen = StackScreenProps<AppointmentFlowModalStackParamList, 'CCReasonForAppointmentScreen'>

const CCReasonForAppointmentScreen: FC<CCReasonForAppointmentScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const { gutter, condensedMarginBetween } = theme.dimensions

  const [additionalDetails, setAdditionalDetails] = useState<string>()

  const onSetAdditionalDetails = (data: string) => {
    setAdditionalDetails(data)
  }

  const onContinue = () => {}

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={onContinue}>
      <AppointmentFlowWhiteCtaButton
        mx={10}
        onPress={() => {}}
        text={`${th('component.crisisLine.talkToThe')} ${th('component.crisisLine.veteranCrisisLine')} ${th('component.crisisLine.now')}`}
      />

      <AppointmentFlowTitleSection title={t('requestAppointment.whatReasonForCare')} />
      <Box mx={gutter}>
        <TextView variant="MobileBodyBold" mb={condensedMarginBetween}>
          {t('requestAppointment.additionaldetailsTitle')}
        </TextView>
        <VATextInput inputType={'none'} onChange={onSetAdditionalDetails} isTextArea={true} value={additionalDetails} />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default CCReasonForAppointmentScreen
