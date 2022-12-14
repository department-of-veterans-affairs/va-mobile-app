import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { BenefitsStackParamList } from './BenefitsStackScreens'
import { Box, FocusedNavHeaderText, LargeNavButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'

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
    </BenefitsScreenStack.Navigator>
  )
}

export default BenefitsStackScreen
