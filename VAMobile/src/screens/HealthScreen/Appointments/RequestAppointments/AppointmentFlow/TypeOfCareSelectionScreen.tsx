import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { TYPE_OF_CARE } from 'store/api'
import { useRouteNavigation } from 'utils/hooks'
import AppointmentFlowLayout from './AppointmentFlowLayout'

type TypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'TypeOfCareSelectionScreen'>

const TypeOfCareSelectionScreen: FC<TypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const [selectedTypeOfCare, setSelectedTypeOfCare] = useState<string>()
  const [nonSelectedError, SetNonSelectedError] = useState(false)

  const navigateToReason = navigateTo('AppointmentFlowStep2')

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      SetNonSelectedError(false)
      setSelectedTypeOfCare(type)
    }
  }

  const getTypesOfCare = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []

    TYPE_OF_CARE.sort((a, b) => {
      return a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
    })

    for (const typesOfCare of TYPE_OF_CARE) {
      typesOfCareOptions.push({
        value: typesOfCare.id ? typesOfCare.id : typesOfCare.name,
        labelKey: typesOfCare.label ? typesOfCare.label : typesOfCare.name,
      })
    }
    return typesOfCareOptions
  }

  const onContinue = () => {
    if (!selectedTypeOfCare) {
      SetNonSelectedError(true)
    } else {
      navigateToReason()
    }
  }

  return (
    <AppointmentFlowLayout
      pageTitle={t('requestAppointment.whatTypeOfCare')}
      isError={nonSelectedError}
      errorMessage={t('requestAppointment.typeOfCareNotSelectedError')}
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}>
      <RadioGroup options={getTypesOfCare()} onChange={onSetSelectedTypeOfCare} value={selectedTypeOfCare} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default TypeOfCareSelectionScreen
