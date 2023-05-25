import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ButtonTypesConstants, FeatureLandingTemplate, LoadingComponent, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState } from 'store/slices'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import NoLettersScreen from './NoLettersScreen'

type LettersOverviewProps = StackScreenProps<BenefitsStackParamList, 'LettersOverview'>

/**
 * Landing page for the letters flow. Shows the current address and the button to go to the letters list
 */
const LettersOverviewScreen: FC<LettersOverviewProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const navigateTo = useRouteNavigation()
  const { loading, error } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)

  const onViewPressed = navigateTo('LettersList')

  const onAddressPress = navigateTo('EditAddress', {
    displayTitle: t('contactInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onAddressPress }]

  if (error) {
    return (
      <FeatureLandingTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.title')}>
        <NoLettersScreen />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.title')}>
        <LoadingComponent />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.title')} {...testIdProps('Letters-page')}>
      <Box {...testIdProps(t('letters.overview.documents'))} accessible={true}>
        <TextView variant="MobileBody" mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          {t('letters.overview.documents')}
        </TextView>
      </Box>
      <AddressSummary addressData={addressData} />
      <Box {...testIdProps(t('letters.overview.ifThisAddress'))} accessible={true}>
        <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
          {t('letters.overview.ifThisAddress')}
        </TextView>
      </Box>
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.contentMarginBottom}>
        <VAButton
          onPress={onViewPressed}
          label={t('letters.overview.viewLetters')}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('letters.overview.viewLetters.hint')}
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default LettersOverviewScreen
