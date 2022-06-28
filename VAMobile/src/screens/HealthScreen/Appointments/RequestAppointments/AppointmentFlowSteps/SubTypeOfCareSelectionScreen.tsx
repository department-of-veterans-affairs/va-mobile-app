import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { NAMESPACE } from 'constants/namespaces'
import { LoadingComponent, RadioGroup, radioOption } from 'components'
import { SetIsVAEligibleType, useCheckEligibilityAndRouteUser, useSetIsVAEligible } from 'utils/requestAppointments'
import { SubCareDataMapping, TypeOfCareWithSubCareIdType } from 'store/api/types'
import { useRouteNavigation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { RequestAppointmentState } from 'store/slices/requestAppointmentSlice'

type SubTypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'SubTypeOfCareSelectionScreen'>

/** Component that will allow user to select a sub care  */
const SubTypeOfCareSelectionScreen: FC<SubTypeOfCareSelectionScreenProps> = ({ navigation, route }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { selectedTypeOfCareId } = route.params
  const [selectedSubTypeOfCare, setSelectedSubTypeOfCare] = useState<string>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState(false)
  const { loadingCCEligibility } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)

  let subTypeCareData: Array<SetIsVAEligibleType> = []
  const setIsVAEligible = useSetIsVAEligible()
  const checkEligibility = useCheckEligibilityAndRouteUser()

  const navigateToReasonCC = navigateTo('CCReasonForAppointmentScreen')
  const navigateToHelpScreen = navigateTo('SubTypeHelpScreen', { careTypeId: selectedTypeOfCareId })

  const onSetSelectedTypeOfCare = (type: string): void => {
    if (type) {
      setNoTypeSelectedError(false)
      setSelectedSubTypeOfCare(type)
    }
  }

  const getSubCareText = (returnErrorText = false) => {
    const subTypeTitles: Record<TypeOfCareWithSubCareIdType, string> = {
      sleepParentCare: t('requestAppointment.sleepSubCareTypeText'),
      audiology: t('requestAppointment.audiologySubCareTypeText'),
      eyeParentCare: t('requestAppointment.eyeSubCareTypeText'),
    }
    const subTypeName = subTypeTitles[selectedTypeOfCareId as TypeOfCareWithSubCareIdType]

    if (returnErrorText) {
      return t('requestAppointment.whatSubTypeOfCareNotSelectedError', { subTypeName })
    }

    return t('requestAppointment.whatSubTypeOfCare', { subTypeName })
  }

  const getTypesOfSubCare = () => {
    const typesOfCareOptions: Array<radioOption<string>> = []

    subTypeCareData = setIsVAEligible(SubCareDataMapping[selectedTypeOfCareId as TypeOfCareWithSubCareIdType])

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
      if (selectedTypeOfCareId === 'audiology') {
        navigateToReasonCC()
      } else {
        checkEligibility(selectedSubTypeOfCare, subTypeCareData)
      }
    }
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      linkText={t('requestAppointment.modalNeedHelpChoosingLinkTitle')}
      onLinkPress={navigateToHelpScreen}>
      {loadingCCEligibility ? (
        <LoadingComponent />
      ) : (
        <>
          <AppointmentFlowTitleSection title={getSubCareText()} error={noTypeSelectedError} errorMessage={getSubCareText(true)} />
          <RadioGroup options={getTypesOfSubCare()} onChange={onSetSelectedTypeOfCare} value={selectedSubTypeOfCare} isRadioList={true} />
        </>
      )}
    </AppointmentFlowLayout>
  )
}

export default SubTypeOfCareSelectionScreen
