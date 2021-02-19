import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, LoadingComponent, SegmentedControl } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from './ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getAllClaimsAndAppeals } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import ClaimsAndAppealsListView, { ClaimTypeConstants } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsScreen: FC<IClaimsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { loadingAllClaimsAndAppeals, claimsServiceError, appealsServiceError } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const claimType = selectedTab === t('claimsTab.active') ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsAndAppealsServiceErrors = !!claimsServiceError && !!appealsServiceError

  // load all claims and appeals and filter upon mount
  // let ClaimsAndAppealsListView handle subsequent filtering to avoid reloading all claims and appeals
  useEffect(() => {
    dispatch(getAllClaimsAndAppeals(ScreenIDTypesConstants.CLAIMS_SCREEN_ID))
  }, [dispatch])

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  if (useError(ScreenIDTypesConstants.CLAIMS_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loadingAllClaimsAndAppeals) {
    return <LoadingComponent />
  }

  const serviceErrorAlert = (): ReactElement => {
    // if there is a claims service error or an appeals service error
    if (!!claimsServiceError || !!appealsServiceError) {
      let alertTitle, alertText, alertTextA11yLabel

      // if both services failed
      if (claimsAndAppealsServiceErrors) {
        alertTitle = t('claimsAndAppeal.claimAndAppealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaimsAndAppeals')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingClaimsAndAppealsA11yLabel')

        // if claims service fails but appeals did not
      } else if (!!claimsServiceError && !appealsServiceError) {
        alertTitle = t('claimsAndAppeal.claimStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaims')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingClaimsA11yLabel')

        // if appeals service fails but claims does not
      } else if (!!appealsServiceError && !claimsServiceError) {
        alertTitle = t('claimsAndAppeal.appealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingAppeals')
        alertTextA11yLabel = t('claimsAndAppeal.troubleLoadingAppealsA11yLabel')
      }

      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <AlertBox title={alertTitle} text={alertText} textA11yLabel={alertTextA11yLabel} border="error" background="noCardBackground" />
        </Box>
      )
    }

    return <></>
  }

  return (
    <ScrollView {...testIdProps('Claims-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {!claimsAndAppealsServiceErrors && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={accessibilityHints}
            />
          </Box>
        )}
        {serviceErrorAlert()}
        {!claimsAndAppealsServiceErrors && (
          <Box flex={1}>
            <ClaimsAndAppealsListView claimType={claimType} />
          </Box>
        )}
      </Box>
    </ScrollView>
  )
}

type ClaimsStackScreenProps = Record<string, unknown>

const ClaimsScreenStack = createStackNavigator()

/**
 * Stack screen for the claims tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const ClaimsStackScreen: FC<ClaimsStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const headerStyles = useHeaderStyles()

  return (
    <ClaimsScreenStack.Navigator screenOptions={headerStyles}>
      <ClaimsScreenStack.Screen name="Appointment" component={ClaimsScreen} options={{ title: t('title') }} />
    </ClaimsScreenStack.Navigator>
  )
}

export default ClaimsStackScreen
