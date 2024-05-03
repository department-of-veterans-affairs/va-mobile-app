import React from 'react'
import { useTranslation } from 'react-i18next'

import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { Box, CategoryLanding, LargeNavButton, TextView, VAIcon } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import ClaimsScreen from 'screens/BenefitsScreen/ClaimsScreen'
import AppealDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealDetailsScreen'
import ClaimDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimDetailsScreen'
import FileRequest from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import ClaimsHistoryScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimsHistoryScreen/ClaimsHistoryScreen'
import DisabilityRatingsScreen from 'screens/BenefitsScreen/DisabilityRatingsScreen'
import { LettersListScreen, LettersOverviewScreen } from 'screens/BenefitsScreen/Letters'
import BenefitSummaryServiceVerification from 'screens/BenefitsScreen/Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
import GenericLetter from 'screens/BenefitsScreen/Letters/GenericLetter/GenericLetter'
import { DowntimeFeatureTypeConstants } from 'store/api'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

import { BenefitsStackParamList } from './BenefitsStackScreens'
import ClaimLettersScreen from './ClaimsScreen/ClaimLettersScreen/ClaimLettersScreen'

type BenefitsScreenProps = StackScreenProps<BenefitsStackParamList, 'Benefits'>

function BenefitsScreen({}: BenefitsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()

  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const featureInDowntime = claimsInDowntime || appealsInDowntime
  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: screenContentAllowed('WG_Benefits') })
  const {
    data: claimsAndAppeals,
    isFetching: loadingClaimsAndAppeals,
    isError: claimsAndAppealsError,
  } = useClaimsAndAppeals('ACTIVE', 1, {
    enabled: isFocused,
  })

  const nonFatalErrors = claimsAndAppeals?.meta.errors?.length
  const activeClaimsCount = claimsAndAppeals?.meta.activeClaimsCount
  const showClaimsCount = !claimsAndAppealsError && !nonFatalErrors && !featureInDowntime && activeClaimsCount

  const showAlert = claimsAndAppealsError || nonFatalErrors || featureInDowntime
  const alertVariant = claimsAndAppealsError || nonFatalErrors ? 'CategoryLandingError' : 'CategoryLandingWarning'
  const alertMessage = featureInDowntime
    ? t('benefits.activity.warning.downtime')
    : nonFatalErrors
      ? t('benefits.activity.nonFatalError')
      : t('benefits.activity.error')

  const onDisabilityRatings = () => {
    navigateTo('DisabilityRatings')
  }

  const onClaims = () => {
    if (featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters) {
      navigateTo('Claims')
    } else {
      navigateTo('ClaimsHistoryScreen')
    }
  }

  const onLetters = () => {
    navigateTo('LettersOverview')
  }

  return (
    <CategoryLanding title={t('benefits.title')} testID="benefitsTestID">
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton
          title={t('claims.title')}
          subText={showClaimsCount ? t('claims.activityButton.subText', { count: activeClaimsCount }) : undefined}
          showLoading={loadingClaimsAndAppeals}
          onPress={onClaims}
        />
        <LargeNavButton title={t('lettersAndDocs.title')} onPress={onLetters} />
        <LargeNavButton title={t('disabilityRating.title')} onPress={onDisabilityRatings} />
        {showAlert && (
          <Box
            mx={theme.dimensions.condensedMarginBetween}
            mt={theme.dimensions.standardMarginBetween}
            flexDirection="row"
            accessible={true}
            accessibilityRole={'text'}
            accessibilityLabel={t('errorIcon') + alertMessage}>
            <VAIcon
              accessible={false}
              importantForAccessibility="no"
              width={24}
              height={24}
              preventScaling={true}
              name="ExclamationCircle"
              fill="homeScreenError"
              mt={3}
            />
            <TextView
              accessible={false}
              importantForAccessibility="no"
              variant={alertVariant}
              ml={theme.dimensions.condensedMarginBetween}
              flex={1}>
              {alertMessage}
            </TextView>
          </Box>
        )}
      </Box>
    </CategoryLanding>
  )
}

const BenefitsScreenStack = createStackNavigator<BenefitsStackParamList>()

/**
 * Stack screen for the Benefits tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
function BenefitsStackScreen() {
  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }
  return (
    <BenefitsScreenStack.Navigator
      screenOptions={screenOptions}
      screenListeners={{
        transitionStart: (e) => {
          if (e.data.closing) {
            CloseSnackbarOnNavigation(e.target)
          }
        },
        blur: (e) => {
          CloseSnackbarOnNavigation(e.target)
        },
      }}>
      <BenefitsScreenStack.Screen name="Benefits" component={BenefitsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen
        name="BenefitSummaryServiceVerificationLetter"
        component={BenefitSummaryServiceVerification}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="AppealDetailsScreen"
        component={AppealDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen name="Claims" component={ClaimsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen
        name="ClaimLettersScreen"
        component={ClaimLettersScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="ClaimsHistoryScreen"
        component={ClaimsHistoryScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="ClaimDetailsScreen"
        component={ClaimDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="DisabilityRatings"
        component={DisabilityRatingsScreen}
        options={{ headerShown: false }}
      />
      <BenefitsScreenStack.Screen name="FileRequest" component={FileRequest} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen
        name="FileRequestDetails"
        component={FileRequestDetails}
        options={{ headerShown: false }}
      />
      <BenefitsScreenStack.Screen
        name="GenericLetter"
        component={GenericLetter}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="LettersList"
        component={LettersListScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <BenefitsScreenStack.Screen
        name="LettersOverview"
        component={LettersOverviewScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
    </BenefitsScreenStack.Navigator>
  )
}

export default BenefitsStackScreen
