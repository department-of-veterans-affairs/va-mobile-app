import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { ALWAYS_SHOW_CARE_LIST, FACILITY_FILTER, ScreenIDTypesConstants, TYPE_OF_CARE, TypeOfCareIdV2Types, TypeOfCareObjectType } from 'store/api/types'
import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { ErrorComponent, LoadingComponent, RadioGroup, radioOption } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, getUserFacilities, getUserVAEligibility, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { useAppDispatch, useError, useRouteNavigation } from 'utils/hooks'
import { useCheckEligibilityAndRouteUser, useSetIsVAEligible } from 'utils/requestAppointments'

type TypeOfCareSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'TypeOfCareSelectionScreen'>

const TypeOfCareSelectionScreen: FC<TypeOfCareSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const setIsVaEligible = useSetIsVAEligible<TypeOfCareObjectType>()
  const checkEligibility = useCheckEligibilityAndRouteUser<TypeOfCareObjectType>()
  const [noTypeSelectedError, setNoTypeSelectedError] = useState('')
  let careListData: Array<TypeOfCareObjectType> = []

  const navigateToTypeOfCareNotListed = navigateTo('TypeOfCareNotListedHelpScreen')

  const { loadingCCEligibility, loadingUserFacilities, loadingVAEligibility, appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>(
    (state) => state.requestAppointment,
  )
  const { typeOfCareSelected } = appointmentFlowFormData

  useEffect(() => {
    dispatch(getUserVAEligibility(ScreenIDTypesConstants.APPOINTMENT_REQUEST_TYPE_OF_CARE_SCREEN_ID))
    dispatch(getUserFacilities(FACILITY_FILTER.home))
  }, [dispatch])

  const onSetSelectedTypeOfCare = (care: TypeOfCareIdV2Types): void => {
    if (care) {
      setNoTypeSelectedError('')
      dispatch(updateFormData({ serviceType: care, typeOfCareSelected: care, subTypeSelected: undefined }))
    }
  }

  const getTypesOfCareOptions = () => {
    const typesOfCareOptions: Array<radioOption<TypeOfCareIdV2Types>> = []

    // Get only the type of cares that are always shown and the ones that the user is VA eligible sorted
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
    if (!typeOfCareSelected) {
      setNoTypeSelectedError(t('requestAppointment.typeOfCareNotSelectedError'))
    } else {
      checkEligibility(typeOfCareSelected, careListData, ScreenIDTypesConstants.APPOINTMENT_REQUEST_TYPE_OF_CARE_SCREEN_ID)
    }
  }

  if (useError(ScreenIDTypesConstants.APPOINTMENT_REQUEST_TYPE_OF_CARE_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENT_REQUEST_TYPE_OF_CARE_SCREEN_ID} />
  }

  return (
    <AppointmentFlowLayout
      secondActionButtonPress={onContinue}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      linkText={t('requestAppointment.typeOfCareNotListedModalTitle')}
      onLinkPress={navigateToTypeOfCareNotListed}>
      {loadingCCEligibility || loadingUserFacilities || loadingVAEligibility ? (
        <LoadingComponent />
      ) : (
        <>
          <AppointmentFlowTitleSection title={t('requestAppointment.whatTypeOfCare')} errorMessage={noTypeSelectedError} />
          <RadioGroup options={getTypesOfCareOptions()} onChange={onSetSelectedTypeOfCare} value={typeOfCareSelected} isRadioList={true} />
        </>
      )}
    </AppointmentFlowLayout>
  )
}

export default TypeOfCareSelectionScreen
