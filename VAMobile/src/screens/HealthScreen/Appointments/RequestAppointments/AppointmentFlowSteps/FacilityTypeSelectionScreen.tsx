import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { FACILITY_TYPE } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { useTranslation } from 'react-i18next'

type FacilityTypeSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'FacilityTypeSelectionScreen'>

const FacilityTypeSelectionScreen: FC<FacilityTypeSelectionScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const [selectedFacilityType, setSelectedFacilityType] = useState<string>()
  const [noFacilityTypeSelectedError, setFacilityTypeSelectedError] = useState(false)

  const onSelectedFacilityType = (type: string): void => {
    if (type) {
      setFacilityTypeSelectedError(false)
      setSelectedFacilityType(type)
    }
  }

  const onContinue = () => {
    if (!selectedFacilityType) {
      setFacilityTypeSelectedError(true)
    } else {
      // TODO add logic for va vs cc
    }
  }

  const getFacilityTypes = () => {
    const facilityTypeOptions: Array<radioOption<string>> = []

    for (const facilityType of FACILITY_TYPE) {
      facilityTypeOptions.push({
        value: facilityType.value,
        labelKey: facilityType.label,
      })
    }
    return facilityTypeOptions
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}>
      <AppointmentFlowTitleSection
        title={t('requestAppointment.whereFacilityType')}
        error={noFacilityTypeSelectedError}
        errorMessage={t('requestAppointment.facilityTypeNotSelectedError')}
      />
      <RadioGroup options={getFacilityTypes()} onChange={onSelectedFacilityType} value={selectedFacilityType} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default FacilityTypeSelectionScreen
