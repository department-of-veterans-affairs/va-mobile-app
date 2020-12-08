import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAllClaimsAndAppeals } from 'store/actions'
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
  const dispatch = useDispatch()

  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  useEffect(() => {
    dispatch(getAllClaimsAndAppeals())
  }, [dispatch])

  return (
    <ScrollView>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} {...testIdProps('Claims-screen')}>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
        </Box>
        <Box flex={1}>
          {selectedTab === t('claimsTab.active') && <ClaimsAndAppealsListView claimType={ClaimTypeConstants.ACTIVE} />}
          {selectedTab === t('claimsTab.closed') && <ClaimsAndAppealsListView claimType={ClaimTypeConstants.CLOSED} />}
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
