import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { setReasonCode } from 'utils/requestAppointments'
import { useAppDispatch, useTheme } from 'utils/hooks'

type CCReasonForAppointmentScreen = StackScreenProps<AppointmentFlowModalStackParamList, 'CCReasonForAppointmentScreen'>

const CCReasonForAppointmentScreen: FC<CCReasonForAppointmentScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const { gutter, condensedMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { comment } = appointmentFlowFormData

  useEffect(() => {
    // set the reason code to nothing due to we do not need it for CC
    dispatch(updateFormData(setReasonCode(undefined)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onSetAdditionalDetails = (data: string) => {
    dispatch(updateFormData({ comment: data }))
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
        <VATextInput inputType={'none'} onChange={onSetAdditionalDetails} isTextArea={true} value={comment} />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default CCReasonForAppointmentScreen
