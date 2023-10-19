import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ButtonTypesConstants, FeatureLandingTemplate, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

type LettersOverviewProps = StackScreenProps<BenefitsStackParamList, 'LettersOverview'>

/**
 * Landing page for the letters flow. Shows the current address and the button to go to the letters list
 */
const LettersOverviewScreen: FC<LettersOverviewProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onViewPressed = navigateTo('LettersList')
  const onAddressPress = navigateTo('EditAddress', {
    displayTitle: t('contactInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onAddressPress }]

  return (
    <FeatureLandingTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.title')} {...testIdProps('Letters-page')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} paragraphSpacing={true}>
        {t('letters.overview.documents')}
      </TextView>
      <AddressSummary addressData={addressData} />
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
        {t('letters.overview.ifThisAddress')}
      </TextView>
      <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
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
