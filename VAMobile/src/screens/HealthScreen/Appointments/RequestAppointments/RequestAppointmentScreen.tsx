import { StackNavigationOptions, StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import {
  CCClosestCityScreen,
  CCPreferredLanguageScreen,
  CCReasonForAppointmentScreen,
  ConfirmContactScreen,
  EmergencyAndCrisisScreen,
  FacilityTypeSelectionScreen,
  SubTypeOfCareSelectionScreen,
  TypeOfCareSelectionScreen,
  VAFacilitiesScreen,
  VAReasonForAppointmentScreen,
  VisitTypeSelectionScreen,
} from './AppointmentFlowSteps'
import { CloseModalButton, HeaderIconBtn } from 'components'
import { DateTime } from 'luxon'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { resetFormData } from 'store/slices/requestAppointmentSlice'
import { useAppDispatch, useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks'

export type AppointmentFlowModalStackParamList = WebviewStackParams & {
  TypeOfCareSelectionScreen: undefined
  VAReasonForAppointmentScreen: undefined
  CCReasonForAppointmentScreen: undefined
  CCClosestCityScreen: undefined
  SubTypeOfCareSelectionScreen: undefined
  FacilityTypeSelectionScreen: undefined
  VisitTypeSelectionScreen: undefined
  EmergencyAndCrisisScreen: undefined
  CCPreferredLanguageScreen: undefined
  ConfirmContactScreen: undefined
  VAFacilitiesScreen: undefined
}

type RequestAppointmentScreenProps = StackScreenProps<HealthStackParamList, 'RequestAppointmentScreen'>

const Stack = createStackNavigator<AppointmentFlowModalStackParamList>()

/** Component stack that will  house the appointment request flow steps screens */
const RequestAppointmentScreen: FC<RequestAppointmentScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const theme = useTheme() as VATheme
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const inset = useSafeAreaInsets()
  const [forceFocus, setForceFocus] = useState<string>()

  const headerStyles: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: theme.colors.background.main,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
      height: inset.top + theme.dimensions.headerHeight,
    },
  }

  useEffect(() => {
    navigation.setOptions({
      ...headerStyles,
      headerLeft: () => (
        <CloseModalButton
          key={forceFocus} // force buton to rerender so the reader can focus on it
          buttonText={t('requestAppointment.closeModalBtnTitle')}
          onPress={() => {
            navigation.goBack()
            dispatch(resetFormData())
          }}
          a11yHint={t('requestAppointments.closeModalBtnHint')}
          focusOnButton={true}
        />
      ),
      headerTitle: () => null,
      headerRight: () => (
        <HeaderIconBtn
          iconName="QuestionMark"
          accessibilityHint={t('requestAppointments.helpBtnHint')}
          accessibilityLabel={t('requestAppointment.modalNeedHelpBtnTitle')}
          onPress={navigateTo('GeneralHelpScreen', { title: t('requestAppointments.generalHelpHeaderTitle'), description: t('requestAppointments.generalHelpDescription') })}
        />
      ),
    })
  })

  return (
    <Stack.Navigator
      initialRouteName="EmergencyAndCrisisScreen"
      screenOptions={{ headerShown: false, detachPreviousScreen: false, ...TransitionPresets.SlideFromRightIOS, headerMode: 'screen' }}
      screenListeners={{
        transitionStart: (e) => {
          if (e.data) {
            setForceFocus(DateTime.now().toString())
          }
        },
        blur: () => {
          setForceFocus(DateTime.now().toString())
        },
      }}>
      <Stack.Screen name="EmergencyAndCrisisScreen" component={EmergencyAndCrisisScreen} />
      <Stack.Screen name="TypeOfCareSelectionScreen" component={TypeOfCareSelectionScreen} />
      <Stack.Screen name="VAReasonForAppointmentScreen" component={VAReasonForAppointmentScreen} />
      <Stack.Screen name="CCReasonForAppointmentScreen" component={CCReasonForAppointmentScreen} />
      <Stack.Screen name="CCClosestCityScreen" component={CCClosestCityScreen} />
      <Stack.Screen name="SubTypeOfCareSelectionScreen" component={SubTypeOfCareSelectionScreen} />
      <Stack.Screen name="FacilityTypeSelectionScreen" component={FacilityTypeSelectionScreen} />
      <Stack.Screen name="VisitTypeSelectionScreen" component={VisitTypeSelectionScreen} />
      <Stack.Screen name="CCPreferredLanguageScreen" component={CCPreferredLanguageScreen} />
      <Stack.Screen name="ConfirmContactScreen" component={ConfirmContactScreen} />
      <Stack.Screen name="VAFacilitiesScreen" component={VAFacilitiesScreen} />
    </Stack.Navigator>
  )
}

export default RequestAppointmentScreen
