import { StackNavigationOptions } from '@react-navigation/stack'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { useCallback, useRef } from 'react'

import {
  AVAILABLE_FOR_CC,
  AppointmentFlowFormDataType,
  ScreenIDTypes,
  TypeOfAudiologyCareObjectType,
  TypeOfCareObjectType,
  TypeOfCareWithSubCareIdType,
  TypeOfEyeCareObjectType,
  TypeOfSleepCareObjectType,
  typeOfCareWithSubCareId,
} from 'store/api/types'
import { CloseModalButton, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RequestAppointmentState, finishCheckingCCEligibility, getUserCommunityCareEligibility, updateFormData } from 'store/slices/requestAppointmentSlice'
import { RootState } from 'store'
import { isIOS } from './platform'
import { type } from 'os'
import { useAppDispatch, useRouteNavigation, useTheme } from './hooks'

/** Header style for the modals in the request appointment flow */
export const useRequestAppointmentModalHeaderStyles = (): StackNavigationOptions => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  const headerStyles: StackNavigationOptions = {
    headerStyle: {
      height: 60,
      backgroundColor: theme.colors.background.main,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background.shadow,
    },

    headerLeft: (props) => (
      <CloseModalButton
        buttonText={t('requestAppointment.closeModalBtnTitle')}
        onPress={props.onPress}
        a11yHint={t('requestAppointments.closeModalBtnHint')}
        focusOnButton={isIOS() ? false : true} // this is done due to ios not reading the button name on modal
      />
    ),
    headerTitle: (header) => (
      <TextView variant="MobileBodyBold" allowFontScaling={false}>
        {header.children}
      </TextView>
    ),
  }
  return headerStyles
}

export type SetIsVAEligibleType = TypeOfCareObjectType | TypeOfSleepCareObjectType | TypeOfEyeCareObjectType | TypeOfAudiologyCareObjectType

// Sets the isVAEligible property for the type of care or sub care objects
export function useSetIsVAEligible<T extends SetIsVAEligibleType>() {
  const { vaEligibleTypeOfCares } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  return (data: Array<T>) => {
    return data.map((care) => {
      const careItem = vaEligibleTypeOfCares.find((item) => item.name === care.idV2)
      const isEligible = careItem && (careItem.requestEligibleFacilities.length > 0 || careItem.directEligibleFacilities.length > 0)
      return { ...care, isVaEligible: isEligible }
    })
  }
}

/** checks the eligibility for the selected care against VA and if the care is available for community care it checks the
 * eligibility for that. It also manages where the user should be routed accroding to eligibility.
 */
export const useCheckEligibilityAndRouteUser = <T extends SetIsVAEligibleType>() => {
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { ccEligibilityChecked, ccEligible } = useSelector<RootState, RequestAppointmentState>((state) => state.requestAppointment)
  const isVaEligible = useRef(true)
  const selectedName = useRef<string>('')

  const manageEligibilityRoute = useCallback(
    (isCommunity: boolean | undefined, isVA: boolean) => {
      const navigateToVAReason = navigateTo('VAReasonForAppointmentScreen')
      const navigateToCCReason = navigateTo('CCReasonForAppointmentScreen')
      const navigateToFacilityType = navigateTo('FacilityTypeSelectionScreen')
      const navigateToSchedulingHelp = navigateTo('GeneralHelpScreen', {
        title: t('requestAppointments.scheduleHelpHeaderTitle', { careType: selectedName.current.toLocaleLowerCase() }),
        description: t('requestAppointments.scheduleHelpDescription'),
      })

      if (isCommunity && isVA) {
        navigateToFacilityType()
      } else if (!isCommunity && isVA) {
        navigateToVAReason()
      } else if (isCommunity && !isVA) {
        // if it routes straight to CC than appointment kind is CC
        dispatch(updateFormData({ kind: 'cc' }))
        navigateToCCReason()
      } else {
        navigateToSchedulingHelp()
      }
    },
    [navigateTo, t, dispatch],
  )

  const routeOnEgilibiltyCheck = useCallback(() => {
    if (ccEligibilityChecked) {
      dispatch(finishCheckingCCEligibility())
      manageEligibilityRoute(ccEligible, isVaEligible.current)
    }
  }, [ccEligibilityChecked, manageEligibilityRoute, ccEligible, dispatch])

  useFocusEffect(routeOnEgilibiltyCheck)

  return (selectedTypeOfCare: string, careList: Array<T>, screenID: ScreenIDTypes) => {
    const selectedCare = careList.find((care) => care.idV2 === selectedTypeOfCare)

    if (selectedCare) {
      isVaEligible.current = selectedCare.isVaEligible === undefined ? false : selectedCare.isVaEligible
      selectedName.current = selectedCare.name

      //checks if the selected care could be available in community care if yes than check for the community care eligibility
      if (AVAILABLE_FOR_CC.includes(selectedCare.idV2)) {
        // doing this due to backend not using idv2 value for nutrition
        const typeName = selectedCare.idV2 === 'foodAndNutrition' ? 'nutrition' : selectedCare.idV2
        dispatch(getUserCommunityCareEligibility(typeName, screenID))
      } else {
        manageEligibilityRoute(false, isVaEligible.current)
      }
    }
  }
}

// check if care has sub type care
export const hasSubType = (x: TypeOfCareWithSubCareIdType): x is TypeOfCareWithSubCareIdType => typeOfCareWithSubCareId.includes(x)

// manages the reason data for VA or CC reason of care screen
export const setReasonCode = (data: string | undefined): AppointmentFlowFormDataType => {
  return {
    reasonCode: data
      ? {
          coding: [
            {
              code: data,
            },
          ],
          text: data,
        }
      : undefined,
  }
}
