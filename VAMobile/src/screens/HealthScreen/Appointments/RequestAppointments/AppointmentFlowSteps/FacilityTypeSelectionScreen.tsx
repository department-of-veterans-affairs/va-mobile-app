import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { AppointmentFlowLayout, AppointmentFlowTitleSection } from '../AppointmentFlowCommon'
import { AppointmentFlowModalStackParamList } from '../RequestAppointmentScreen'
import { FACILITY_TYPE, FacilityTypeValueMapping, facilityTypeValueTypes } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { RadioGroup, radioOption } from 'components'
import { RequestAppointmentState, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { useAppDispatch, useRouteNavigation } from 'utils/hooks'

type FacilityTypeSelectionScreenProps = StackScreenProps<AppointmentFlowModalStackParamList, 'FacilityTypeSelectionScreen'>

const FacilityTypeSelectionScreen: FC<FacilityTypeSelectionScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const [noFacilityTypeSelectedError, setFacilityTypeSelectedError] = useState('')

  const navigateToVAReason = navigateTo('VAReasonForAppointmentScreen')
  const navigateToCCReason = navigateTo('CCReasonForAppointmentScreen')
  const navigateToSubType = navigateTo('SubTypeOfCareSelectionScreen')

  const { appointmentFlowFormData } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const { typeOfCareSelected, facilitySelected, kind, subTypeSelected, serviceType } = appointmentFlowFormData

  const onSelectedFacilityType = (facility: facilityTypeValueTypes): void => {
    if (facility) {
      setFacilityTypeSelectedError('')

      let subtype = subTypeSelected
      let typeOfService = serviceType

      const kindType = facility === 'cc' ? facility : kind

      // For audiology if the user selects CC and selects a subtype if they go back and select VA we have to reset the subtype selected and put the service back to audiology
      if (facility === 'va' && typeOfCareSelected === 'audiology') {
        subtype = undefined
        typeOfService = typeOfCareSelected
      }
      dispatch(updateFormData({ facilitySelected: facility, kind: kindType, subTypeSelected: subtype, serviceType: typeOfService }))
    }
  }

  const onContinue = () => {
    if (!facilitySelected) {
      setFacilityTypeSelectedError(t('requestAppointment.facilityTypeNotSelectedError'))
    } else {
      if (facilitySelected === FacilityTypeValueMapping.VA) {
        navigateToVAReason()
      } else {
        if (typeOfCareSelected === 'audiology') {
          navigateToSubType()
        } else {
          navigateToCCReason()
        }
      }
    }
  }

  const getFacilityTypes = () => {
    const facilityTypeOptions: Array<radioOption<facilityTypeValueTypes>> = []

    for (const facilityType of FACILITY_TYPE) {
      facilityTypeOptions.push({
        value: facilityType.value,
        labelKey: facilityType.label,
        a11yLabel: facilityType?.a11yLabel,
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
      <AppointmentFlowTitleSection title={t('requestAppointment.whereFacilityType')} errorMessage={noFacilityTypeSelectedError} />
      <RadioGroup options={getFacilityTypes()} onChange={onSelectedFacilityType} value={facilitySelected} isRadioList={true} />
    </AppointmentFlowLayout>
  )
}

export default FacilityTypeSelectionScreen
