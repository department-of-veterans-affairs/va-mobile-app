import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTextInputWithAlert, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { Box, RadioGroup, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PURPOSE_TEXT } from 'store/api'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { setReasonCode } from 'utils/requestAppointments'
import { useAppDispatch, useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'styled-components'

type VAReasonForAppointmentScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VAReasonForAppointmentScreen'>

const VAReasonForAppointmentScreen: FC<VAReasonForAppointmentScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const dispatch = useAppDispatch()
  const theme = useTheme() as VATheme

  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { text } = appointmentFlowFormData.reasonCode || {}
  const { comment } = appointmentFlowFormData

  const [noReasonSelectedError, setNoReasonSelectedError] = useState('')
  const [noDetailsAddedError, setNoDetailsAddedError] = useState('')

  const navigateToFacilities = navigateTo('VAFacilitiesScreen')

  const onSetSelectedReason = (type: string): void => {
    if (type) {
      setNoReasonSelectedError('')
      dispatch(updateFormData(setReasonCode(type)))
    }
  }

  const onSetAdditionalDetails = (data: string) => {
    if (data) {
      setNoDetailsAddedError('')
    }
    dispatch(updateFormData({ comment: data }))
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
    if (!text) {
      setNoReasonSelectedError(t('requestAppointment.reasonNotSelectedError'))
    }

    if (!comment) {
      setNoDetailsAddedError(t('requestAppointment.additionaldetailsError'))
    }

    if (text && comment) {
      navigateToFacilities()
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

      <AppointmentFlowTitleSection title={t('requestAppointment.whatReasonForCare')} errorMessage={noReasonSelectedError} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <RadioGroup options={getReasons()} onChange={onSetSelectedReason} value={text} isRadioList={true} />
      </Box>
      <AppointmentFlowTextInputWithAlert
        mx={theme.dimensions.gutter}
        inputType={'none'}
        inputLabel={t('requestAppointment.additionaldetailsTitle')}
        onChange={onSetAdditionalDetails}
        errorMessage={noDetailsAddedError}
        value={comment}
        isTextArea={true}
      />
    </AppointmentFlowLayout>
  )
}

export default VAReasonForAppointmentScreen
