import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { Box, CollapsibleView, CrisisLineCta, TextView, VABulletList, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme, useTranslation } from 'utils/hooks'

type LoaGateProps = Record<string, unknown>

const LoaGate: FC<LoaGateProps> = ({}) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.LOGIN)
  const navigateTo = useRouteNavigation()

  const onConfirm = navigateTo('WebviewLogin')
  const onCrisisLine = navigateTo('VeteransCrisisLine')

  return (
    <ScrollView {...testIdProps('Sign-in: L-o-a-gate-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBody">{t('loaGate.p1')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
          <TextView variant="MobileBody">{t('loaGate.readMore.p1')}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold">{t('loaGate.readMore.p2')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody">
              {t('loaGate.readMore.itemOne')}
              <TextView variant="MobileBodyBold">{t('loaGate.readMore.itemOne.and')}</TextView>
            </TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.itemTwo')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[t('loaGate.readMore.bulletOne')]} />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.or')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[t('loaGate.readMore.bulletTwo')]} />
          </Box>
        </CollapsibleView>

        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onConfirm}
            label={t('continueToSignin')}
            textColor="primaryContrast"
            backgroundColor="buttonPrimary"
            a11yHint={t('continueToSignin.a11yHint')}
            testID={t('continueToSignin')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default LoaGate
