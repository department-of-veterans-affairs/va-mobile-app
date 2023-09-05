import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { ErrorComponent, LoadingComponent, RadioGroup, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants, SubCareDataMapping, TypeOfCareIdV2Types, TypeOfCareWithSubCareIdType } from 'store/api/types'
import { SetIsVAEligibleType, useCheckEligibilityAndRouteUser, useSetIsVAEligible } from 'utils/requestAppointments'
import { useAppDispatch, useError, useRouteNavigation } from 'utils/hooks'

type SubTypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'SubTypeOfCareSelectionScreen'>

/** Component that will allow user to select a sub care  */
const SubTypeOfCareSelectionScreen: FC<SubTypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState('')
  const { loadingCCEligibility, appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { subTypeSelected, typeOfCareSelected } = appointmentFlowFormData

  let subTypeCareData: Array<SetIsVAEligibleType> = []
  const setIsVAEligible = useSetIsVAEligible()
  const checkEligibility = useCheckEligibilityAndRouteUser()

  const navigateToReasonCC = navigateTo('CCReasonForAppointmentScreen')
  const navigateToHelpScreen = navigateTo('SubTypeHelpScreen', { careTypeId: typeOfCareSelected })

  const onSetSelectedTypeOfCare = (subCare: TypeOfCareIdV2Types): void => {
    if (subCare) {
      setNoTypeSelectedError('')
      dispatch(updateFormData({ subTypeSelected: subCare, serviceType: subCare }))
    }
  }

  const getSubCareText = (returnErrorText = false) => {
    const subTypeTitles: Record<TypeOfCareWithSubCareIdType, string> = {
      sleepParentCare: t('requestAppointment.sleepSubCareTypeText'),
      audiology: t('requestAppointment.audiologySubCareTypeText'),
      eyeParentCare: t('requestAppointment.eyeSubCareTypeText'),
    }
    let subTypeName = ''

    if (typeOfCareSelected) {
      subTypeName = subTypeTitles[typeOfCareSelected as TypeOfCareWithSubCareIdType]
    }

    if (returnErrorText) {
      return t('requestAppointment.whatSubTypeOfCareNotSelectedError', { subTypeName })
    }

    return t('requestAppointment.whatSubTypeOfCare', { subTypeName })
  }

  const getTypesOfSubCare = () => {
    const typesOfCareOptions: Array<radioOption<TypeOfCareIdV2Types>> = []

    if (typeOfCareSelected) {
      subTypeCareData = setIsVAEligible(SubCareDataMapping[typeOfCareSelected as TypeOfCareWithSubCareIdType])
    }

    for (const subCareData of subTypeCareData) {
      typesOfCareOptions.push({
        value: subCareData.idV2,
        labelKey: subCareData.name,
      })
    }
    return typesOfCareOptions
  }

  if (useError(ScreenIDTypesConstants.APPOINTMENT_REQUEST_SUB_TYPE_OF_CARE_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENT_REQUEST_SUB_TYPE_OF_CARE_SCREEN_ID} />
  }

  const onContinue = () => {
    if (!subTypeSelected) {
      setNoTypeSelectedError(getSubCareText(true))
    } else {
      if (typeOfCareSelected === 'audiology') {
        navigateToReasonCC()
      } else {
        checkEligibility(subTypeSelected, subTypeCareData, ScreenIDTypesConstants.APPOINTMENT_REQUEST_SUB_TYPE_OF_CARE_SCREEN_ID)
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
          <AppointmentFlowTitleSection title={getSubCareText()} errorMessage={noTypeSelectedError} />
          <RadioGroup options={getTypesOfSubCare()} onChange={onSetSelectedTypeOfCare} value={subTypeSelected} isRadioList={true} />
        </>
      )}
    </AppointmentFlowLayout>
  )
}

export default SubTypeOfCareSelectionScreen
