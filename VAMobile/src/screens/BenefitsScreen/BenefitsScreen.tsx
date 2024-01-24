import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { BenefitsStackParamList } from './BenefitsStackScreens'
import { Box, CategoryLanding, LargeNavButton } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { DisabilityRatingState } from 'store/slices'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { LettersListScreen, LettersOverviewScreen } from 'screens/BenefitsScreen/Letters'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import AppealDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealDetailsScreen'
import BenefitSummaryServiceVerification from 'screens/BenefitsScreen/Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
import ClaimDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimLettersScreen from './ClaimsScreen/ClaimLettersScreen/ClaimLettersScreen'
import ClaimsHistoryScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimsHistoryScreen/ClaimsHistoryScreen'
import ClaimsScreen from 'screens/BenefitsScreen/ClaimsScreen'
import DisabilityRatingsScreen from 'screens/BenefitsScreen/DisabilityRatingsScreen'
import FileRequest from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import GenericLetter from 'screens/BenefitsScreen/Letters/GenericLetter/GenericLetter'

type BenefitsScreenProps = StackScreenProps<BenefitsStackParamList, 'Benefits'>

function BenefitsScreen({}: BenefitsScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)
  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: screenContentAllowed('WG_Benefits') })

  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent }) : undefined

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
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('disabilityRating.title')}
          onPress={onDisabilityRatings}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText={combinedPercentText}
        />
        <LargeNavButton
          title={t('claims.title')}
          onPress={onClaims}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('lettersAndDocs.title')}
          onPress={onLetters}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
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
      <BenefitsScreenStack.Screen name="BenefitSummaryServiceVerificationLetter" component={BenefitSummaryServiceVerification} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="AppealDetailsScreen" component={AppealDetailsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="Claims" component={ClaimsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="ClaimLettersScreen" component={ClaimLettersScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="ClaimsHistoryScreen" component={ClaimsHistoryScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="DisabilityRatings" component={DisabilityRatingsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="FileRequest" component={FileRequest} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="FileRequestDetails" component={FileRequestDetails} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="GenericLetter" component={GenericLetter} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="LettersList" component={LettersListScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <BenefitsScreenStack.Screen name="LettersOverview" component={LettersOverviewScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
    </BenefitsScreenStack.Navigator>
  )
}

export default BenefitsStackScreen
