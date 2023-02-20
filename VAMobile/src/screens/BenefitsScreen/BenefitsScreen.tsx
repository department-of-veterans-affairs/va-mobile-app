import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { BenefitsStackParamList } from './BenefitsStackScreens'
import { Box, CategoryLanding, FocusedNavHeaderText, LargeNavButton } from 'components'
import { DisabilityRatingState } from 'store/slices'
import { LettersListScreen, LettersOverviewScreen } from 'screens/BenefitsScreen/Letters'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'

import { CloseSnackbarOnNavigation } from 'constants/common'
import AppealDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealDetailsScreen'
import ClaimDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimsScreen from 'screens/BenefitsScreen/ClaimsScreen'
import DisabilityRatingsScreen from 'screens/BenefitsScreen/DisabilityRatingsScreen'
import GenericLetter from 'screens/BenefitsScreen/Letters/GenericLetter/GenericLetter'

type BenefitsScreenProps = StackScreenProps<BenefitsStackParamList, 'Benefits'>

const BenefitsScreen: FC<BenefitsScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const ratingPercent = ratingData?.combinedDisabilityRating
  const ratingIsDefined = ratingPercent !== undefined && ratingPercent !== null
  const combinedPercentText = ratingIsDefined ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent }) : undefined

  return (
    <CategoryLanding title={t('benefits.title')}>
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('disabilityRating.title')}
          onPress={navigateTo('DisabilityRatings')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText={combinedPercentText}
        />
        <LargeNavButton
          title={t('claims.title')}
          onPress={navigateTo('Claims')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('lettersAndDocs.title')}
          onPress={navigateTo('LettersOverview')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
      </Box>
    </CategoryLanding>
  )
}

type BenefitsStackScreenProps = Record<string, unknown>

const BenefitsScreenStack = createStackNavigator()

/**
 * Stack screen for the Benefits tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const BenefitsStackScreen: FC<BenefitsStackScreenProps> = () => {
  const headerStyles = useHeaderStyles()

  return (
    <BenefitsScreenStack.Navigator
      screenOptions={headerStyles}
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
      <BenefitsScreenStack.Screen name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="Claims" component={ClaimsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="DisabilityRatings" component={DisabilityRatingsScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="GenericLetter" component={GenericLetter} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="LettersList" component={LettersListScreen} options={{ headerShown: false }} />
      <BenefitsScreenStack.Screen name="LettersOverview" component={LettersOverviewScreen} options={{ headerShown: false }} />
    </BenefitsScreenStack.Navigator>
  )
}

export default BenefitsStackScreen
