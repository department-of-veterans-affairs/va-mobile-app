import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { ALWAYS_SHOW_CARE_LIST, TYPE_OF_CARE, TypeOfCareObjectType, TypeOfCareWithSubCareIdType } from 'store/api/types'
import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { hasSubType, useCheckEligibilityAndRouteUser, useSetIsVAEligible } from 'utils/requestAppointments'
import { useRouteNavigation } from 'utils/hooks'

type TypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'TypeOfCareSelectionScreen'>

const TypeOfCareSelectionScreen: FC<TypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const setIsVaEligible = useSetIsVAEligible<TypeOfCareObjectType>()
  const checkEligibility = useCheckEligibilityAndRouteUser<TypeOfCareObjectType>()
  const [selectedTypeOfCare, setSelectedTypeOfCare] = useState<string>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState(false)

  let careListData: Array<TypeOfCareObjectType> = []

  const navigateToTypeOfCareNotListed = navigateTo('TypeOfCareNotListedHelpScreen')
  const navigateToSubType = navigateTo('SubTypeOfCareSelectionScreen', { selectedTypeOfCareId: selectedTypeOfCare })

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      setNoTypeSelectedError(false)
      setSelectedTypeOfCare(type)
    }
  }

  const getTypesOfCareOptions = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []

    // Get only the type of cares that are always shown and the ones that the user is eligible for sorted
    careListData = setIsVaEligible(TYPE_OF_CARE)
      .filter((care) => {
        return ALWAYS_SHOW_CARE_LIST.includes(care.idV2) || care.isVaEligible
      })
      .sort((a, b) => {
        return a.name.toLocaleUpperCase() > b.name.toLocaleUpperCase() ? 1 : -1
      })

    for (const typesOfCare of careListData) {
      typesOfCareOptions.push({
        value: typesOfCare.idV2,
        labelKey: typesOfCare.label ? typesOfCare.label : typesOfCare.name,
      })
    }
    return typesOfCareOptions
  }

  const onContinue = () => {
    if (!selectedTypeOfCare) {
      setNoTypeSelectedError(true)
    } else {
      // if it has subtype but is not audiology send to subtype page
      if (hasSubType(selectedTypeOfCare as TypeOfCareWithSubCareIdType) && selectedTypeOfCare !== 'audiology') {
        navigateToSubType()
      } else {
        checkEligibility(selectedTypeOfCare, careListData)
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
      <RadioGroup options={getTypesOfCareOptions()} onChange={onSetSelectedTypeOfCare} value={selectedTypeOfCare} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default TypeOfCareSelectionScreen
