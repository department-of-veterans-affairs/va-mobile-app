import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { VISIT_TYPE } from 'store/api'
import { useTranslation } from 'react-i18next'

type VisitTypeSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'VisitTypeSelectionScreen'>

const VisitTypeSelectionScreen: FC<VisitTypeSelectionScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const [selectedVisitType, setSelectedVisitType] = useState<string>()
  const [noVisitTypeSelectedError, setVisitTypeSelectedError] = useState(false)

  const onSelectedVisitType = (type: string): void => {
    if (type) {
      setVisitTypeSelectedError(false)
      setSelectedVisitType(type)
    }
  }

  const onContinue = () => {
    if (!selectedVisitType) {
      setVisitTypeSelectedError(true)
    } else {
      // TODO add next navigation
    }
  }

  const getVisitTypes = () => {
    const visitTypeOptions: Array<radioOption<string>> = []

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
      <RadioGroup options={getVisitTypes()} onChange={onSelectedVisitType} value={selectedVisitType} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default VisitTypeSelectionScreen
