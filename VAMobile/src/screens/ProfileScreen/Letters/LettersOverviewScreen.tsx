import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, LoadingComponent, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import AddressSummary, { addressDataField, profileAddressOptions } from '../AddressSummary'

type LettersOverviewProps = Record<string, unknown>

/**
 * Landing page for the letters flow. Shows the current address and the button to go to the letters list
 */
const LettersOverviewScreen: FC<LettersOverviewProps> = ({}) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { loading } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const onViewPressed = navigateTo('LettersList')

  const onAddressPress = navigateTo('EditAddress', {
    displayTitle: t('personalInformation.mailingAddress'),
    addressType: profileAddressOptions.MAILING_ADDRESS,
  })

  const addressData: Array<addressDataField> = [{ addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onAddressPress }]

  if (loading) {
    return <LoadingComponent />
  }

  return (
    <ScrollView {...testIdProps('Letters-page')}>
      <Box {...testIdProps(t('letters.overview.documents'))} accessible={true}>
        <TextView variant="MobileBody" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.standardMarginBetween}>
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
    </ScrollView>
  )
}

export default LettersOverviewScreen
