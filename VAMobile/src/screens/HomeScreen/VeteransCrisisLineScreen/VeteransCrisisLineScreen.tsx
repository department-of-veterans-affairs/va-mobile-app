import { Linking, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkTypeOptionsConstants, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_VETERANS_CRISIS_LINE_GET_HELP, LINK_URL_VETERANS_CRISIS_LINE } = getEnv()

/**
 * View for Veterans Crisis Line screen
 *
 * Returns VeteransCrisisLineScreen component
 */
const VeteransCrisisLineScreen: FC = () => {
  const t = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const marginBetween = theme.dimensions.marginBetween

  const redirectToVeteransCrisisLineLink = (): void => {
    Linking.openURL(LINK_URL_VETERANS_CRISIS_LINE)
  }

  return (
    <ScrollView {...testIdProps('Veterans-Crisis-Line-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('veteransCrisisLine.weAreHereForYou')}
          </TextView>
          <Box mt={marginBetween}>
            <TextView variant="MobileBody">{t('veteransCrisisLine.connectWithResponders')}</TextView>
          </Box>
          <Box mt={marginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.crisisCallNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.crisisCallNumber')}
              linkType={LinkTypeOptionsConstants.call}
              {...a11yHintProp(t('veteransCrisisLine.callA11yHint'))}
            />
          </Box>
          <Box mt={marginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.textNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.textNumber')}
              linkType={LinkTypeOptionsConstants.text}
              {...a11yHintProp(t('veteransCrisisLine.textA11yHint'))}
            />
          </Box>
          <Box mt={marginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.startConfidentialChat')}
              numberOrUrlLink={LINK_URL_VETERANS_CRISIS_LINE_GET_HELP}
              linkType={LinkTypeOptionsConstants.url}
              {...a11yHintProp(t('veteransCrisisLine.crisisUrlA11yHint'))}
            />
          </Box>
          <Box mt={marginBetween}>
            <TextView variant="MobileBody">{t('veteransCrisisLine.callTTY')}</TextView>
          </Box>
          <Box mt={marginBetween}>
            <ClickForActionLink
              displayedText={t('veteransCrisisLine.hearingLossNumberDisplayed')}
              numberOrUrlLink={t('veteransCrisisLine.hearingLossNumber')}
              linkType={LinkTypeOptionsConstants.call}
              {...a11yHintProp(t('veteransCrisisLine.callA11yHint'))}
            />
          </Box>
          <Box mt={marginBetween}>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('veteransCrisisLine.getMoreResources')}
            </TextView>
          </Box>
          <Box mt={marginBetween}>
            <TouchableWithoutFeedback
              onPress={redirectToVeteransCrisisLineLink}
              {...testIdProps(t('veteransCrisisLine.urlDisplayed'))}
              {...a11yHintProp(t('veteransCrisisLine.urlA11yHint'))}
              accessibilityRole="link">
              <TextView variant="MobileBody" color="link">
                {t('veteransCrisisLine.urlDisplayed')}
              </TextView>
            </TouchableWithoutFeedback>
          </Box>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default VeteransCrisisLineScreen
