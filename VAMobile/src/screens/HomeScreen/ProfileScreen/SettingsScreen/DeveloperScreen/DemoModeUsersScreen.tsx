import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, RadioGroup, radioOption } from 'components'
import FloatingButton from 'components/FloatingButton'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import DemoUsers, { DemoUserIds } from 'store/api/demo/mocks/users'
import { DEMO_USER_STORAGE_KEY, logout } from 'store/slices/authSlice'
import { useAppDispatch } from 'utils/hooks'

type DemoModeUsersScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'DemoModeUsers'>

function DemoModeUsersScreen({ navigation, route }: DemoModeUsersScreenSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const [demoUser, setDemoUser] = useState('kimberlyWashington')

  const { fromLogin } = route.params

  useEffect(() => {
    AsyncStorage.getItem(DEMO_USER_STORAGE_KEY).then((storedDemoUser) => {
      if (storedDemoUser) {
        setDemoUser(storedDemoUser)
      }
    })
  }, [])

  const demoUsers: Array<radioOption<string>> = Object.keys(DemoUsers).map((id) => ({
    optionLabelKey: DemoUsers[id as DemoUserIds].name,
    value: id,
    additionalLabelText: [DemoUsers[id as DemoUserIds].notes || ''],
  }))

  const getDoneButton = () => {
    return (
      <FloatingButton
        onPress={async () => {
          await AsyncStorage.setItem(DEMO_USER_STORAGE_KEY, demoUser)
          if (fromLogin) {
            navigation.goBack()
          } else {
            dispatch(logout())
          }
        }}
        label={fromLogin ? 'Save' : 'Save and Logout'}
        testID={'demoModeUserSave'}
        isHidden={false}
      />
    )
  }

  return (
    <FeatureLandingTemplate
      backLabelOnPress={navigation.goBack}
      title={t('demoModeUsers.title')}
      footerContent={getDoneButton()}
      testID="demoModeUserTestID">
      <Box mb={100}>
        <RadioGroup isRadioList value={demoUser} options={demoUsers} onChange={setDemoUser} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default DemoModeUsersScreen
