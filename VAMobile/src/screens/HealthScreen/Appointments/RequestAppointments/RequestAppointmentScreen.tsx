import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, CloseModalButton, HeaderIconBtn } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ReasonForAppointmentScreen, SubTypeOfCareSelectionScreen, TypeOfCareSelectionScreen } from './AppointmentFlowSteps'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { useRouteNavigation } from 'utils/hooks'

export type AppointmentFlowModalStackParamList = WebviewStackParams & {
  TypeOfCareSelectionScreen: undefined
  ReasonForAppointmentScreen: undefined
  SubTypeOfCareSelectionScreen: {
    selectedTypeOfCareId: string
  }
}

type RequestAppointmentScreenProps = StackScreenProps<HealthStackParamList, 'RequestAppointmentScreen'>

const Stack = createStackNavigator<AppointmentFlowModalStackParamList>()

/** Component stack that will  house the appointment request flow steps screens */
const RequestAppointmentScreen: FC<RequestAppointmentScreenProps> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const inset = useSafeAreaInsets()

  return (
    <Box flex={1} backgroundColor="main">
      <Box alignItems="center" justifyContent="space-between" flexDirection="row" mt={inset.top}>
        <CloseModalButton buttonText={t('requestAppointment.closeModalBtnTitle')} onPress={navigation.goBack} a11yHint={t('requestAppointments.closeModalBtnHint')} />
        <HeaderIconBtn
          iconName="QuestionMark"
          accessibilityHint={t('requestAppointments.helpBtnHint')}
          accessibilityLabel={t('requestAppointment.modalNeedHelpBtnTitle')}
          onPress={navigateTo('GeneralHelpScreen')}
        />
      </Box>
      <Stack.Navigator initialRouteName="TypeOfCareSelectionScreen" screenOptions={{ headerShown: false, detachPreviousScreen: false }}>
        <Stack.Screen name="TypeOfCareSelectionScreen" component={TypeOfCareSelectionScreen} />
        <Stack.Screen name="ReasonForAppointmentScreen" component={ReasonForAppointmentScreen} />
        <Stack.Screen name="SubTypeOfCareSelectionScreen" component={SubTypeOfCareSelectionScreen} />
      </Stack.Navigator>
    </Box>
  )
}

export default RequestAppointmentScreen
