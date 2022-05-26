import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { TYPE_OF_CARE, TypeOfCareWithSubCareIdType, typeOfCareWithSubCareId } from 'store/api'
import { useRouteNavigation } from 'utils/hooks'

type TypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'TypeOfCareSelectionScreen'>

const TypeOfCareSelectionScreen: FC<TypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const [selectedTypeOfCare, setSelectedTypeOfCare] = useState<string>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState(false)

  const navigateToReason = navigateTo('ReasonForAppointmentScreen')
  const navigateToSubType = navigateTo('SubTypeOfCareSelectionScreen', { selectedTypeOfCareId: selectedTypeOfCare })

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      setNoTypeSelectedError(false)
      setSelectedTypeOfCare(type)
    }
  }

  const hasSubType = (x: TypeOfCareWithSubCareIdType): x is TypeOfCareWithSubCareIdType => typeOfCareWithSubCareId.includes(x)

  const getTypesOfCare = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []

    TYPE_OF_CARE.sort((a, b) => {
      return a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    })

    for (const typesOfCare of TYPE_OF_CARE) {
      typesOfCareOptions.push({
        value: typesOfCare.id,
        labelKey: typesOfCare.label ? typesOfCare.label : typesOfCare.name,
      })
    }
    return typesOfCareOptions
  }

  const onContinue = () => {
    if (!selectedTypeOfCare) {
      setNoTypeSelectedError(true)
    } else {
      if (hasSubType(selectedTypeOfCare as TypeOfCareWithSubCareIdType)) {
        navigateToSubType()
      } else {
        navigateToReason()
      }
    }
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}>
      <AppointmentFlowTitleSection title={t('requestAppointment.whatTypeOfCare')} error={noTypeSelectedError} errorMessage={t('requestAppointment.typeOfCareNotSelectedError')} />
      <RadioGroup options={getTypesOfCare()} onChange={onSetSelectedTypeOfCare} value={selectedTypeOfCare} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default TypeOfCareSelectionScreen
