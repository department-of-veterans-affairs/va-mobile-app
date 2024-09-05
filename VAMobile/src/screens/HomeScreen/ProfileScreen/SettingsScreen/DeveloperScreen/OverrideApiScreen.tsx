import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'

type OverrideAPIScreenProps = StackScreenProps<HomeStackParamList, 'OverrideAPI'>

function OverrideAPIScreen({ navigation }: OverrideAPIScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <FeatureLandingTemplate
      backLabel={t('debug.title')}
      backLabelOnPress={navigation.goBack}
      title={t('overrideAPI')}
      testID="overrideAPITestID">
      <Box>
        <TextView>Category</TextView>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default OverrideAPIScreen
