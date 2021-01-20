import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { Box, CollapsibleView, CrisisLineCta, TextView, VABulletList, VAButton } from 'components'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme, useTranslation } from 'utils/hooks'

type LoaGateProps = {}

const LoaGate: FC<LoaGateProps> = ({}) => {
  const theme = useTheme()
  const t = useTranslation('login')
  const navigateTo = useRouteNavigation()

  const onConfirm = (): void => {
    navigateTo('WebviewLogin')()
  }

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  return (
    <ScrollView {...testIdProps('Loa-gate-screen')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBody">{t('loaGate.p1')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.marginBetween}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
          <TextView variant="MobileBody">{t('loaGate.readMore.p1')}</TextView>
          <Box mt={theme.dimensions.marginBetween}>
            <TextView variant="MobileBodyBold">{t('loaGate.readMore.p2')}</TextView>
          </Box>
          <Box mt={theme.dimensions.marginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.itemOne')}</TextView>
          </Box>
          <Box mt={theme.dimensions.marginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.itemTwo')}</TextView>
          </Box>
          <Box mt={theme.dimensions.marginBetween}>
            <VABulletList listOfText={[t('loaGate.readMore.bulletOne')]} />
          </Box>
          <Box mt={theme.dimensions.marginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.or')}</TextView>
          </Box>
          <Box mt={theme.dimensions.marginBetween}>
            <VABulletList listOfText={[t('loaGate.readMore.bulletTwo')]} />
          </Box>
        </CollapsibleView>

        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onConfirm}
            label={t('continueToSignin')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('continueToSignin.a11yHint')}
            testID={'continue-signin-button'}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default LoaGate
