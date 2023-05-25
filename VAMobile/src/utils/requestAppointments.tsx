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
  TypeOfCareIdV2Types,
  TypeOfCareNameTypes,
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
import { VATheme } from 'styles/theme'
import { isIOS } from './platform'
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
      let isEligible: boolean | undefined

      if (care.idV2 === 'sleepParentCare') {
        const cpapCare = vaEligibleTypeOfCares.find((item) => item.name === 'cpap')
        const homeSleepCare = vaEligibleTypeOfCares.find((item) => item.name === 'homeSleepTesting')
        const cpapEligible = cpapCare && (cpapCare.requestEligibleFacilities.length > 0 || cpapCare.directEligibleFacilities.length > 0)
        const homeSleepCareEligible = homeSleepCare && (homeSleepCare.requestEligibleFacilities.length > 0 || homeSleepCare.directEligibleFacilities.length > 0)
        isEligible = cpapEligible || homeSleepCareEligible
      } else {
        const careItem = vaEligibleTypeOfCares.find((item) => item.name === care.idV2)
        isEligible = careItem && (careItem.requestEligibleFacilities.length > 0 || careItem.directEligibleFacilities.length > 0)
      }

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
  const selectedName = useRef<TypeOfCareNameTypes>()
  const selectedIdV2 = useRef<TypeOfCareIdV2Types>()

  const manageEligibilityRoute = useCallback(
    (isCommunity: boolean | undefined, isVA: boolean, goToSubType = false) => {
      const navigateToVAReason = navigateTo('VAReasonForAppointmentScreen')
      const navigateToCCReason = navigateTo('CCReasonForAppointmentScreen')
      const navigateToFacilityType = navigateTo('FacilityTypeSelectionScreen')
      const navigateToSchedulingHelp = navigateTo('GeneralHelpScreen', {
        title: t('requestAppointments.scheduleHelpHeaderTitle', { careType: selectedName.current?.toLocaleLowerCase() }),
        description: t('requestAppointments.scheduleHelpDescription'),
      })
      const navigateToSubType = navigateTo('SubTypeOfCareSelectionScreen')

      if (goToSubType) {
        navigateToSubType()
      } else if (isCommunity && isVA) {
        navigateToFacilityType()
      } else if (!isCommunity && isVA) {
        navigateToVAReason()
      } else if (isCommunity && !isVA) {
        // if it routes straight to CC than appointment kind is CC
        dispatch(updateFormData({ kind: 'cc' }))

        // If the care selected was audiology route to subtype when is cc only
        if (selectedIdV2.current === 'audiology') {
          navigateToSubType()
        } else {
          navigateToCCReason()
        }
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
      selectedIdV2.current = selectedCare.idV2

      //checks if the selected care could be available in community care if yes than check for the community care eligibility
      if (AVAILABLE_FOR_CC.includes(selectedIdV2.current)) {
        // doing this due to backend not using idv2 value for nutrition
        const typeName = selectedIdV2.current === 'foodAndNutrition' ? 'nutrition' : selectedIdV2.current
        dispatch(getUserCommunityCareEligibility(typeName, screenID))
      } else {
        if (selectedIdV2.current === 'eyeParentCare' || (selectedIdV2.current === 'sleepParentCare' && isVaEligible.current)) {
          manageEligibilityRoute(false, isVaEligible.current, true)
        } else {
          manageEligibilityRoute(false, isVaEligible.current)
        }
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

// method to create the list of languages used on the appointment request flow.
export const usePreferredLanguageList = (): Array<string> => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const listOfLanguagePref = [
    '',
    t('requestAppointments.langPrefEnglish'),
    t('requestAppointments.langPrefChinese'),
    t('requestAppointments.langPrefFrench'),
    t('requestAppointments.langPrefGerman'),
    t('requestAppointments.langPrefItalian'),
    t('requestAppointments.langPrefKorean'),
    t('requestAppointments.langPrefPortuguese'),
    t('requestAppointments.langPrefRussian'),
    t('requestAppointments.langPrefSpanish'),
    t('requestAppointments.langPrefTagalog'),
    t('requestAppointments.langPrefVietnamese'),
    t('requestAppointments.langPrefOther'),
  ]

  return listOfLanguagePref
}
