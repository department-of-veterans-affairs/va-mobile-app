import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from '../../ProfileBanner'

/**
 * Screen for displaying information on updating direct deposit information for MHV/DS logon users
 */
const HowToUpdateDirectDepositScreen: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <>
      <VAScrollView {...testIdProps('Direct-deposit: How-to-update-direct-deposit-page')}>
        <ProfileBanner />
        <Box mt={standardMarginBetween} mx={theme.dimensions.gutter}>
          <AlertBox title={t('howToUpdateDirectDeposit.alert.title')} border="warning" background="noCardBackground" text={t('howToUpdateDirectDeposit.alert.body')} />
        </Box>
        <Box mt={standardMarginBetween} mb={theme.dimensions.contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" accessibilityLabel={t('veteransCrisisLine.weAreHereForYou.a11yLabel')}>
              {t('howToUpdateDirectDeposit.card.title')}
            </TextView>
            <Box mt={standardMarginBetween}>
              <TextView variant="MobileBody">{t('howToUpdateDirectDeposit.card.callUs')}</TextView>
            </Box>
            <ClickToCallPhoneNumber phone={t('common:8008271000')} displayedText={t('common:8008271000.displayText')} />
          </TextArea>
        </Box>
      </VAScrollView>
    </>
  )
}

export default HowToUpdateDirectDepositScreen
