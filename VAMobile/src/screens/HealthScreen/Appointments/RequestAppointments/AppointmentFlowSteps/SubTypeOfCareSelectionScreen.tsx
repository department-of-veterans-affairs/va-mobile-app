import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { SubCareDataMapping, SubCareTitleMapping, TypeOfCareWithSubCareIdType } from 'store/api'
import { useRouteNavigation } from 'utils/hooks'

type SubTypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'SubTypeOfCareSelectionScreen'>

/** Component that will allow user to select a sub care  */
const SubTypeOfCareSelectionScreen: FC<SubTypeOfCareSelectionScreenProps> = ({ navigation, route }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { selectedTypeOfCareId } = route.params

  const [selectedSubTypeOfCare, setSelectedSubTypeOfCare] = useState<string>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState(false)

  const navigateToReason = navigateTo('ReasonForAppointmentScreen')

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      setNoTypeSelectedError(false)
      setSelectedSubTypeOfCare(type)
    }
  }

  const getSubTypeTitle = () => {
    const subTypeName = SubCareTitleMapping[selectedTypeOfCareId as TypeOfCareWithSubCareIdType]
    return t('requestAppointment.whatSubTypeOfCare', { subTypeName })
  }

  const getSubTypeErrorMessage = () => {
    const subTypeName = SubCareTitleMapping[selectedTypeOfCareId as TypeOfCareWithSubCareIdType]
    return t('requestAppointment.whatSubTypeOfCareNotSelectedError', { subTypeName })
  }

  const getTypesOfSubCare = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []
    const subTypeCareData = SubCareDataMapping[selectedTypeOfCareId as TypeOfCareWithSubCareIdType]

    for (const subCareData of subTypeCareData) {
      typesOfCareOptions.push({
        value: subCareData.idV2,
        labelKey: subCareData.name,
      })
    }
    return typesOfCareOptions
  }

  const onContinue = () => {
    if (!selectedSubTypeOfCare) {
      setNoTypeSelectedError(true)
    } else {
      navigateToReason()
    }
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      linkText={t('requestAppointment.modalNeedHelpChoosingLinkTitle')}>
      <AppointmentFlowTitleSection title={getSubTypeTitle()} error={noTypeSelectedError} errorMessage={getSubTypeErrorMessage()} />
      <RadioGroup options={getTypesOfSubCare()} onChange={onSetSelectedTypeOfCare} value={selectedSubTypeOfCare} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default SubTypeOfCareSelectionScreen
