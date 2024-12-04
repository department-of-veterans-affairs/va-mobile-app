import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, FeatureLandingTemplate, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import AddressSummary, {
  addressDataField,
  profileAddressOptions,
} from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import NoLettersScreen from './NoLettersScreen'

type LettersOverviewProps = StackScreenProps<BenefitsStackParamList, 'LettersOverview'>

function LettersOverviewScreen({ navigation }: LettersOverviewProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { MAILING_ADDRESS } = profileAddressOptions

  const onEditAddress = () => {
    logAnalyticsEvent(Events.vama_click(t('contactInformation.mailingAddress'), t('letters.overview.title')))
    navigateTo('EditAddress', { displayTitle: t('contactInformation.mailingAddress'), addressType: MAILING_ADDRESS })
  }

  const addressData: Array<addressDataField> = [{ addressType: MAILING_ADDRESS, onPress: onEditAddress }]

  return (
    <FeatureLandingTemplate
      backLabel={t('benefits.title')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.overview.title')}
      testID="lettersPageID">
      {!userAuthorizedServices?.lettersAndDocuments ? (
        <NoLettersScreen />
      ) : (
        <>
          <TextView variant="MobileBody" mx={theme.dimensions.gutter} paragraphSpacing={true}>
            {t('letters.overview.documents')}
          </TextView>
          <AddressSummary addressData={addressData} />
          <TextView
            variant="MobileBody"
            mx={theme.dimensions.gutter}
            mt={theme.dimensions.standardMarginBetween}
            paragraphSpacing={true}>
            {t('letters.overview.ifThisAddress')}
          </TextView>
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
            <Button
              onPress={() => navigateTo('LettersList')}
              label={t('letters.overview.viewLetters')}
              a11yHint={t('letters.overview.viewLetters.hint')}
              testID="lettersOverviewViewLettersButtonID"
            />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default LettersOverviewScreen
