import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { FormKindType, VISIT_TYPE } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { useAppDispatch, useRouteNavigation } from 'utils/hooks'

type VisitTypeSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VisitTypeSelectionScreen'>

const VisitTypeSelectionScreen: FC<VisitTypeSelectionScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { kind } = appointmentFlowFormData

  const [noVisitTypeSelectedError, setVisitTypeSelectedError] = useState('')

  const navigateToConfirmContact = navigateTo('ConfirmContactScreen')

  const onSelectedVisitType = (kindOfVisit: FormKindType): void => {
    if (kindOfVisit) {
      setVisitTypeSelectedError('')
      dispatch(updateFormData({ kind: kindOfVisit }))
    }
  }

  const onContinue = () => {
    if (!kind) {
      setVisitTypeSelectedError(t('requestAppointment.visitTypeNotSelectedError'))
    } else {
      navigateToConfirmContact()
    }
  }

  const getVisitTypes = () => {
    const visitTypeOptions: Array<radioOption<FormKindType>> = []

    for (const visitType of VISIT_TYPE) {
      visitTypeOptions.push({
        value: visitType.value,
        labelKey: visitType.label,
        a11yLabel: visitType?.a11yLabel,
      })
    }
    return visitTypeOptions
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}>
      <AppointmentFlowTitleSection title={t('requestAppointment.whichVisitType')} errorMessage={noVisitTypeSelectedError} />
      <RadioGroup options={getVisitTypes()} onChange={onSelectedVisitType} value={kind} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default VisitTypeSelectionScreen
