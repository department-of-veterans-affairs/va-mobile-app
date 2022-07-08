import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AlertBox, Box, RadioGroup, TextView, VATextInput, radioOption } from 'components'
import { AppointmentFlowLayout, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { PURPOSE_TEXT } from 'store/api'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { setReasonCode } from 'utils/requestAppointments'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

type VAReasonForAppointmentScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VAReasonForAppointmentScreen'>

const VAReasonForAppointmentScreen: FC<VAReasonForAppointmentScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { gutter, contentMarginBottom, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { text: reasonText, coding: reasonCoding = [] } = appointmentFlowFormData.reasonCode || {}

  const [noReasonSelectedError, setNoReasonSelectedError] = useState(false)
  const [noDetailsAddedError, setNoDetailsAddedError] = useState(false)

  const navigateToVisitType = navigateTo('VisitTypeSelectionScreen')

  const onSetSelectedReason = (type: string): void => {
    if (type) {
      setNoReasonSelectedError(false)
      dispatch(updateFormData(setReasonCode(type, reasonText)))
    }
  }

  const onSetAdditionalDetails = (data: string) => {
    if (data) {
      setNoDetailsAddedError(false)
    }
    dispatch(updateFormData(setReasonCode(reasonCoding[0]?.code, data)))
  }

  const getReasons = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []

    for (const typesOfCare of PURPOSE_TEXT) {
      typesOfCareOptions.push({
        value: typesOfCare.id,
        labelKey: typesOfCare.label,
      })
    }
    return typesOfCareOptions
  }

  const onContinue = () => {
    if (!reasonCoding || reasonCoding.length === 0) {
      setNoReasonSelectedError(true)
    }

    if (!reasonText) {
      setNoDetailsAddedError(true)
    }

    if (reasonCoding && reasonCoding.length > 0 && reasonText) {
      dispatch
      navigateToVisitType()
    }
  }

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

      <AppointmentFlowTitleSection title={t('requestAppointment.whatReasonForCare')} error={noReasonSelectedError} errorMessage={t('requestAppointment.reasonNotSelectedError')} />
      <Box mb={contentMarginBottom}>
        <RadioGroup options={getReasons()} onChange={onSetSelectedReason} value={reasonCoding[0]?.code} isRadioList={true} />
      </Box>
      <Box mx={gutter}>
        <TextView variant="MobileBodyBold" mb={condensedMarginBetween}>
          {t('requestAppointment.additionaldetailsTitle')}
        </TextView>
        {noDetailsAddedError && (
          <Box mb={standardMarginBetween} mt={condensedMarginBetween}>
            <AlertBox border={'error'} title={t('requestAppointment.additionaldetailsError')} />
          </Box>
        )}
        <VATextInput inputType={'none'} onChange={onSetAdditionalDetails} isTextArea={true} value={reasonText} />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default VAReasonForAppointmentScreen
