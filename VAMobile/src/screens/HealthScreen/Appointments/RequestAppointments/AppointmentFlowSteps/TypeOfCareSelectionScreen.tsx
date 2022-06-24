import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { ALWAYS_SHOW_CARE_LIST, TYPE_OF_CARE, TypeOfCareWithSubCareIdType, typeOfCareWithSubCareId } from 'store/api'
import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { RequestAppointmentState } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { useRouteNavigation } from 'utils/hooks'
import { useSelector } from 'react-redux'

type TypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'TypeOfCareSelectionScreen'>

const TypeOfCareSelectionScreen: FC<TypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const [selectedTypeOfCare, setSelectedTypeOfCare] = useState<string>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState(false)

  const navigateToReason = navigateTo('ReasonForAppointmentScreen')
  const navigateToTypeOfCareNotListed = navigateTo('TypeOfCareNotListedHelpScreen')
  const navigateToSubType = navigateTo('SubTypeOfCareSelectionScreen', { selectedTypeOfCareId: selectedTypeOfCare })
  const { eligibleTypeOfCares } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)

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

    // Get only the type of cares that are always shown and the ones that the user is eligible for
    const eligibleCares = TYPE_OF_CARE.filter((care) => {
      const careItem = eligibleTypeOfCares.find((item) => item.name === care.idV2)

      // if it is one of the always shown care or has a facility in the request or direct eligibility list
      return ALWAYS_SHOW_CARE_LIST.includes(care.name) || (careItem && (careItem.requestEligibleFacilities.length > 0 || careItem.directEligibleFacilities.length > 0))
    })

    for (const typesOfCare of eligibleCares) {
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
      }}
      linkText={t('requestAppointment.typeOfCareNotListedModalTitle')}
      onLinkPress={navigateToTypeOfCareNotListed}>
      <AppointmentFlowTitleSection title={t('requestAppointment.whatTypeOfCare')} error={noTypeSelectedError} errorMessage={t('requestAppointment.typeOfCareNotSelectedError')} />
      <RadioGroup options={getTypesOfCare()} onChange={onSetSelectedTypeOfCare} value={selectedTypeOfCare} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default TypeOfCareSelectionScreen
