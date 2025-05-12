import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ChildTemplate, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

// todo: rename this to SelectCareSystem
type SelectCareTeamProps = StackScreenProps<HealthStackParamList, 'SelectCareTeam'>
const SelectCareTeam = ({ navigation, route }: SelectCareTeamProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  return (
    <ChildTemplate
      title={t('secureMessaging.selectRecipient.title')}
      backLabel={t('back')}
      backLabelOnPress={navigation.goBack}>
      <Box px={10}>
        <TextView variant="MobileBody">{t('secureMessaging.selectRecipient.pickTeam')}</TextView>
        <TextView variant="HelperText">{t('secureMessaging.selectRecipient.step2')}</TextView>
      </Box>
    </ChildTemplate>
  )
}

export default SelectCareTeam
