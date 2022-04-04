import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import { RadioGroup, radioOption } from 'components'
import { useRouteNavigation } from 'utils/hooks'
import AppointmentFlowLayout from './AppointmentFlowLayout'

type AppointmentFlowStep1Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep1'>

const AppointmentFlowStep1: FC<AppointmentFlowStep1Props> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const [selectedTypeOfCare, setSelectedTypeOfCare] = useState<string>()

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      setSelectedTypeOfCare(type)
    }
  }

  const getTypesOfCare = () => {
    const typesOfCare: Array<radioOption<string>> = []

    typesOfCare.push(
      {
        value: 'Amputation care',
        labelKey: 'Amputation care',
      },
      {
        value: 'Covid 19 vaccine',
        labelKey: 'Covid 19 vaccine',
      },
      {
        value: 'Mental health',
        labelKey: 'Mental health',
      },
      {
        value: 'Primary care',
        labelKey: 'Primary care',
      },
      {
        value: 'Eye care',
        labelKey: 'Eye care',
      },
    )
    return typesOfCare
  }

  return (
    <AppointmentFlowLayout
      onClose={() => {
        navigation.getParent()?.goBack()
      }}
      secondActionButtonPress={navigateTo('AppointmentFlowStep2')}
      disableFirstAction={true}
      disableSecondAction={!selectedTypeOfCare ? true : false}>
      {/* TODO: Be removed and replaced with actual form */}
      <RadioGroup
        options={getTypesOfCare()}
        onChange={onSetSelectedTypeOfCare}
        value={selectedTypeOfCare}
        isRadioList={true}
        disabled={true}
        radioListTitle={'Choose the type of care you need (Required)'}
      />
    </AppointmentFlowLayout>
  )
}

export default AppointmentFlowStep1
