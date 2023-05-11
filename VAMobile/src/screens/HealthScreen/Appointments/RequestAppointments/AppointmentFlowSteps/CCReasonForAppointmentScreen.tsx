import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTextInputWithAlert, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { setReasonCode } from 'utils/requestAppointments'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

type CCReasonForAppointmentScreen = StackScreenProps<AppointmentFlowModalStackParamList, 'CCReasonForAppointmentScreen'>

const CCReasonForAppointmentScreen: FC<CCReasonForAppointmentScreen> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { gutter } = theme?.dimensions?
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

  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={navigateTo('CCClosestCityScreen')}>
      <AppointmentFlowWhiteCtaButton
        mx={10}
        onPress={() => {}}
        text={`${th('component.crisisLine.talkToThe')} ${th('component.crisisLine.veteranCrisisLine')} ${th('component.crisisLine.now')}`}
      />
      <AppointmentFlowTitleSection title={t('requestAppointment.whatReasonForCare')} />
      <AppointmentFlowTextInputWithAlert
        mx={gutter}
        inputType={'none'}
        inputLabel={t('requestAppointment.additionaldetailsTitle')}
        onChange={onSetAdditionalDetails}
        value={comment}
        isTextArea={true}
      />
    </AppointmentFlowLayout>
  )
}

export default CCReasonForAppointmentScreen
