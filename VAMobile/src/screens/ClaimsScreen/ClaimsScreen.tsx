import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FocusedNavHeaderText, LoadingComponent, SegmentedControl, VAScrollView } from 'components'
import { AuthorizedServicesState, ClaimsAndAppealsState, PersonalInformationState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from './ClaimsStackScreens'
import { HeaderTitleType } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getProfileInfo, prefetchClaimsAndAppeals } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import ClaimsAndAppealsListView, { ClaimTypeConstants } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import NoClaimsAndAppealsAccess from './NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'

type IClaimsScreen = StackScreenProps<ClaimsStackParamList, 'Claims'>

const ClaimsScreen: FC<IClaimsScreen> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { loadingClaimsAndAppeals, claimsServiceError, appealsServiceError } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { claims: claimsAuthorization, appeals: appealsAuthorization } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const claimsAndAppealsAccess = claimsAuthorization || appealsAuthorization
  const { loading: personalInformationLoading, needsDataLoad: personalInformationNeedsUpdate } = useSelector<StoreState, PersonalInformationState>((s) => s.personalInformation)
  const controlValues = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const claimType = selectedTab === t('claimsTab.active') ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsAndAppealsServiceErrors = !!claimsServiceError && !!appealsServiceError

  useEffect(() => {
    // Fetch the profile information
    if (personalInformationNeedsUpdate) {
      dispatch(getProfileInfo(ScreenIDTypesConstants.CLAIMS_SCREEN_ID))
    }
  }, [dispatch, personalInformationNeedsUpdate])

  // load claims and appeals and filter upon mount
  // fetch the first page of Active and Closed
  useEffect(() => {
    if (claimsAndAppealsAccess) {
      dispatch(prefetchClaimsAndAppeals(ScreenIDTypesConstants.CLAIMS_SCREEN_ID))
    }
  }, [dispatch, claimsAndAppealsAccess])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitleType: HeaderTitleType) => <FocusedNavHeaderText headerTitleType={headerTitleType} />,
    })
  }, [navigation])

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  if (useError(ScreenIDTypesConstants.CLAIMS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.CLAIMS_SCREEN_ID} />
  }

  if (loadingClaimsAndAppeals || personalInformationLoading) {
    return <LoadingComponent text={t('claimsAndAppeals.loadingClaimsAndAppeals')} />
  }

  if (!claimsAndAppealsAccess) {
    return <NoClaimsAndAppealsAccess />
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
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          <AlertBox title={alertTitle} text={alertText} textA11yLabel={alertTextA11yLabel} border="error" background="noCardBackground" />
        </Box>
      )
    }

    return <></>
  }

  return (
    <VAScrollView {...testIdProps('Claims-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {!claimsAndAppealsServiceErrors && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
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
    </VAScrollView>
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
