import { StackNavigationOptions, TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import CloseModalButton from 'components/CloseModalButton'
import React, { FC } from 'react'

import { Box, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { useTheme } from 'utils/hooks'
import AppointmentFlowStep2 from './AppointmentFlow/AppointmentFlowStep2'
import TypeOfCareSelectionScreen from './AppointmentFlow/TypeOfCareSelectionScreen'

export type AppointmentFlowModalStackParamList = WebviewStackParams & {
  TypeOfCareSelectionScreen: undefined
  AppointmentFlowStep2: undefined
}

const Stack = createStackNavigator<AppointmentFlowModalStackParamList>()

/** Component that will be launch as a modal and house the appointment request flow steps */
const AppointmentFlowModal: FC = () => {
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const headerStyles: StackNavigationOptions = {
    headerShown: false,
    animationEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
    detachPreviousScreen: false,
  }

  return (
    <Box flex={1} backgroundColor="main">
      <Box alignItems="center" justifyContent="space-between" flexDirection="row">
        <CloseModalButton
          buttonText={t('requestAppointment.closeModalBtnTitle')}
          onPress={() => {
            navigation.goBack()
          }}
          a11yHint={t('appointments.closeAppointmentRequestModal')}
        />
        <Box
          mr={20}
          accessible={true}
          accessibilityLabel={t('requestAppointment.modalNeedHelpBtnTitle')}
          accessibilityRole={'button'}
          height={theme.dimensions.headerHeight}
          alignItems={'center'}
          justifyContent={'center'}
          width={40}>
          <VAIcon name="QuestionMark" width={20} height={20} fill="primary" preventScaling={true} />
        </Box>
      </Box>
      <Stack.Navigator initialRouteName="TypeOfCareSelectionScreen" screenOptions={{ ...headerStyles }}>
        <Stack.Screen name="TypeOfCareSelectionScreen" component={TypeOfCareSelectionScreen} />
        <Stack.Screen name="AppointmentFlowStep2" component={AppointmentFlowStep2} />
      </Stack.Navigator>
    </Box>
  )
}

export default AppointmentFlowModal
