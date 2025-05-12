import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import styled from 'styled-components'
import { map } from 'underscore'

import { Box, BoxProps, ChildTemplate, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type SelectRecipientProps = StackScreenProps<HealthStackParamList, 'SelectCareSystem'>
const SelectCareSystem = ({ navigation, route }: SelectRecipientProps) => {
  const { recipientsByHealthSystem } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  const selectorRowStyles: BoxProps = {
    height: 54,
    backgroundColor: 'list',
    borderColor: 'primary',
    borderStyle: 'solid',
    borderBottomWidth: theme.dimensions.borderWidth,
    borderRadius: 8,
    justifyContent: 'center',
    px: theme.dimensions.condensedMarginBetween,
  }

  const renderSelector = () => {
    return (
      <VAScrollView contentContainerStyle={scrollStyles}>
        <Box px={theme.dimensions.condensedMarginBetween}>
          {map(recipientsByHealthSystem, (recipients, healthCareSystemName) => {
            return (
              <Box {...selectorRowStyles}>
                <TextView>{healthCareSystemName}</TextView>
              </Box>
            )
          })}
        </Box>
      </VAScrollView>
    )
  }

  const StyledSafeAreaView = styled(SafeAreaView)`
    background-color: ${theme.colors.background.navButton};
  `

  return (
    <ChildTemplate
      title={t('secureMessaging.selectRecipient.title')}
      backLabel={t('back')}
      backLabelOnPress={navigation.goBack}>
      <Box px={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
        <TextView variant="MobileBody">{t('secureMessaging.selectRecipient.pickSystem')}</TextView>
        <TextView variant="HelperText">{t('secureMessaging.selectRecipient.step1')}</TextView>
      </Box>
      {/*<Box px={theme.dimensions.condensedMarginBetween}>*/}
      {renderSelector()}
      {/*</Box>*/}
      <StyledSafeAreaView edges={['bottom']}>
        <Box px={theme.dimensions.condensedMarginBetween} gap={8}>
          <Button label={t('next')} onPress={() => navigateTo('SelectCareTeam')} />
          <Button buttonType={ButtonVariants.Secondary} label={t('back')} onPress={navigation.goBack} />
        </Box>
      </StyledSafeAreaView>
    </ChildTemplate>
  )
}

export default SelectCareSystem
