import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, TextViewProps, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ScrollViewBlueBackground } from 'styles/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const OnboardingAppOverview: FC = () => {
  const t = useTranslation(NAMESPACE.LOGIN)
  const theme = useTheme()
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const firstName = profile?.firstName ? `, ${profile?.firstName}` : ''

  const welcomeMessageProps: TextViewProps = {
    variant: 'MobileBodyBold',
    color: 'primaryContrast',
    accessibilityRole: 'header',
    my: theme.dimensions.marginBetween,
  }

  return (
    <ScrollViewBlueBackground {...testIdProps('Onboarding: App Overview')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Box my={theme.dimensions.marginBetween}>
          <VAIcon name="Logo" />
        </Box>
        <TextView {...welcomeMessageProps} {...testIdProps(t('onboarding.welcomeMessageA11yLabel', { firstName }))}>
          {t('onboarding.welcomeMessage', { firstName })}
        </TextView>
        <TextView variant="MobileBody" color="primaryContrast">
          {t('onboarding.allInformationYouNeed')}
        </TextView>
      </Box>
    </ScrollViewBlueBackground>
  )
}

export default OnboardingAppOverview
