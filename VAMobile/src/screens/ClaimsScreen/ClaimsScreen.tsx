import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { Box, LoadingComponent, SegmentedControl } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { getActiveOrClosedClaimsAndAppeals, getAllClaimsAndAppeals } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import AppealDetailsScreen from './AppealDetailsScreen/AppealDetailsScreen'
import ClaimDetailsScreen from './ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimsAndAppealsListView, { ClaimType, ClaimTypeConstants } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import ConsolidatedClaimsNote from './ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import WhatDoIDoIfDisagreement from './ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'

export type ClaimsStackParamList = {
  Claims: undefined
  ClaimDetailsScreen: {
    claimID: string
    claimType: ClaimType
  }
  ConsolidatedClaimsNote: undefined
  WhatDoIDoIfDisagreement: undefined
  AppealDetailsScreen: {
    appealID: string
  }
}

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { loading } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const claimType = selectedTab === t('claimsTab.active') ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED

  useEffect(() => {
    const getAllClaimsAndAppealsData = async (): Promise<void> => {
      await dispatch(getAllClaimsAndAppeals())
      await dispatch(getActiveOrClosedClaimsAndAppeals(claimType))
    }
    getAllClaimsAndAppealsData()
  }, [dispatch, claimType])

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} {...testIdProps('Claims-screen')}>
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <SegmentedControl
            values={controlValues}
            titles={controlValues}
            onChange={setSelectedTab}
            selected={controlValues.indexOf(selectedTab)}
            accessibilityHints={accessibilityHints}
          />
        </Box>
        <Box flex={1}>
          <ClaimsAndAppealsListView claimType={claimType} />
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
      <ClaimsStack.Screen name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('claimDetails.title') }} />
      <ClaimsStack.Screen name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />
      <ClaimsStack.Screen name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />
      <ClaimsStack.Screen name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('appealDetails.title') }} />
    </ClaimsStack.Navigator>
  )
}

export default ClaimsStackScreen
