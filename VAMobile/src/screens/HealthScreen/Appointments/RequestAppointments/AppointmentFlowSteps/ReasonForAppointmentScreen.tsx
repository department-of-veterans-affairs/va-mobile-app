import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AlertBox, Box, RadioGroup, TextView, VATextInput, radioOption } from 'components'
import { AppointmentFlowLayout, AppointmentFlowTitleSection, AppointmentFlowWhiteCtaButton } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { PURPOSE_TEXT } from 'store/api'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type ReasonForAppointmentScreen = StackScreenProps<AppointmentFlowModalStackParamList, 'ReasonForAppointmentScreen'>

const ReasonForAppointmentScreen: FC<ReasonForAppointmentScreen> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const { gutter, contentMarginBottom, condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const [selectedReason, setSelectedReason] = useState<string>()
  const [additionalDetails, setAdditionalDetails] = useState<string>()
  const [noReasonSelectedError, setNoReasonSelectedError] = useState(false)
  const [noDetailsAddedError, setNoDetailsAddedError] = useState(false)

  const navigateToFacilityType = navigateTo('FacilityTypeSelectionScreen')

  const onSetSelectedReason = (type: string): void => {
    if (type) {
      setNoReasonSelectedError(false)
      setSelectedReason(type)
    }
  }

  const onSetAdditionalDetails = (data: string) => {
    if (data) {
      setNoDetailsAddedError(false)
    }
    setAdditionalDetails(data)
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
    if (!selectedReason) {
      setNoReasonSelectedError(true)
    }

    if (!additionalDetails) {
      setNoDetailsAddedError(true)
    }

    if (selectedReason && additionalDetails) {
      navigateToFacilityType()
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
        <RadioGroup options={getReasons()} onChange={onSetSelectedReason} value={selectedReason} isRadioList={true} />
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
        <VATextInput inputType={'none'} onChange={onSetAdditionalDetails} isTextArea={true} value={additionalDetails} />
      </Box>
    </AppointmentFlowLayout>
  )
}

export default ReasonForAppointmentScreen
