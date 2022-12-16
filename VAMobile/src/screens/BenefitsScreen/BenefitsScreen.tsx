import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { BenefitsStackParamList } from './BenefitsStackScreens'
import { Box, FocusedNavHeaderText, LargeNavButton, VAScrollView } from 'components'
import { LettersListScreen, LettersOverviewScreen } from 'screens/BenefitsScreen/Letters'
import { NAMESPACE } from 'constants/namespaces'
import { useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'

import AppealDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/AppealDetailsScreen/AppealDetailsScreen'
import ClaimDetailsScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimsScreen from 'screens/BenefitsScreen/ClaimsScreen'
import DisabilityRatingsScreen from 'screens/BenefitsScreen/DisabilityRatingsScreen'
import GenericLetter from 'screens/BenefitsScreen/Letters/GenericLetter/GenericLetter'

type BenefitsScreenProps = StackScreenProps<BenefitsStackParamList, 'Benefits'>

const BenefitsScreen: FC<BenefitsScreenProps> = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('claims.title')}
          onPress={navigateTo('Claims')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText=""
        />
        <LargeNavButton
          title={t('disabilityRating.title')}
          onPress={navigateTo('DisabilityRatings')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText=""
        />
        <LargeNavButton
          title={t('lettersAndDocs.title')}
          onPress={navigateTo('LettersOverview')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText=""
        />
      </Box>
    </VAScrollView>
  )
}

type BenefitsStackScreenProps = Record<string, unknown>

const BenefitsScreenStack = createStackNavigator()

/**
 * Stack screen for the Benefits tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const BenefitsStackScreen: FC<BenefitsStackScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const headerStyles = useHeaderStyles()

  return (
    <BenefitsScreenStack.Navigator screenOptions={headerStyles}>
      <BenefitsScreenStack.Screen name="Benefits" component={BenefitsScreen} options={{ title: t('benefits.title') }} />
      <BenefitsScreenStack.Screen name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('statusDetails.title') }} />
      <BenefitsScreenStack.Screen name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />
      <BenefitsScreenStack.Screen name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('statusDetails.title') }} />
      <BenefitsScreenStack.Screen name="DisabilityRatings" component={DisabilityRatingsScreen} options={{ title: t('disabilityRatingDetails.title') }} />
      <BenefitsScreenStack.Screen name="GenericLetter" component={GenericLetter} options={{ title: t('letters.overview.title') }} />
      <BenefitsScreenStack.Screen name="LettersList" component={LettersListScreen} options={{ title: t('letters.overview.title') }} />
      <BenefitsScreenStack.Screen name="LettersOverview" component={LettersOverviewScreen} options={{ title: t('letters.overview.title') }} />
    </BenefitsScreenStack.Navigator>
  )
}

export default BenefitsStackScreen
