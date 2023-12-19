import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ButtonTypesConstants, FeatureLandingTemplate, TextView, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type LettersOverviewProps = StackScreenProps<BenefitsStackParamList, 'LettersOverview'>

/**
 * Landing page for the letters flow. Shows the current address and the button to go to the letters list
 */
const LettersOverviewScreen: FC<LettersOverviewProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onViewLetters = () => {
    navigateTo('LettersList')
  }

  const onEditAddress = () => {
    logAnalyticsEvent(Events.vama_click(t('contactInformation.mailingAddress'), t('letters.overview.title')))
    navigateTo('EditAddress', {
      displayTitle: t('contactInformation.mailingAddress'),
      addressType: profileAddressOptions.MAILING_ADDRESS,
    })
  }

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onEditAddress }]

  return (
    <FeatureLandingTemplate
      backLabel={t('benefits.title')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.overview.title')}
      {...testIdProps('Letters-page')}
      testID="lettersPageID">
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} paragraphSpacing={true}>
        {t('letters.overview.documents')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
        {t('letters.overview.ifThisAddress')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
        <VAButton
          onPress={onViewLetters}
          label={t('letters.overview.viewLetters')}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('letters.overview.viewLetters.hint')}
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default LettersOverviewScreen
