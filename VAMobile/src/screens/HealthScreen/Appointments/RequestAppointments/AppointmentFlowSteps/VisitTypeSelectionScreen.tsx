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
import { useAppDispatch } from 'utils/hooks'

type VisitTypeSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VisitTypeSelectionScreen'>

const VisitTypeSelectionScreen: FC<VisitTypeSelectionScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useAppDispatch()
  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { kind } = appointmentFlowFormData

  const [noVisitTypeSelectedError, setVisitTypeSelectedError] = useState(false)

  const onSelectedVisitType = (kind: FormKindType): void => {
    if (kind) {
      setVisitTypeSelectedError(false)
      dispatch(updateFormData({ kind }))
    }
  }

  const onContinue = () => {
    if (!kind) {
      setVisitTypeSelectedError(true)
    } else {
      // TODO add next navigation
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
      <AppointmentFlowTitleSection
        title={t('requestAppointment.whichVisitType')}
        error={noVisitTypeSelectedError}
        errorMessage={t('requestAppointment.visitTypeNotSelectedError')}
      />
      <RadioGroup options={getVisitTypes()} onChange={onSelectedVisitType} value={kind} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default VisitTypeSelectionScreen
