import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { Box, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import ClaimsAndAppealsListView, { ClaimTypeConstants } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'

type ClaimsStackParamList = {
  Claims: undefined
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  return (
    <ScrollView>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} {...testIdProps('Claims-screen')}>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
        </Box>
        <Box flex={1}>
          <ClaimsAndAppealsListView claimType={selectedTab === t('claimsTab.active') ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED} />
        </Box>
      </Box>
    </ScrollView>
  )
}

type IClaimsStackScreen = {}

const ClaimsStackScreen: FC<IClaimsStackScreen> = () => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const headerStyles = useHeaderStyles()

  return (
    <ClaimsStack.Navigator screenOptions={headerStyles}>
      <ClaimsStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claimsAndAppeals.title') }} />
    </ClaimsStack.Navigator>
  )
}

export default ClaimsStackScreen
