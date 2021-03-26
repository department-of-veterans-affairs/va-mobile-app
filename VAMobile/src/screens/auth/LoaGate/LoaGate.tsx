import React, { FC } from 'react'

import { Box, ButtonTypesConstants, CollapsibleView, CrisisLineCta, TextView, VABulletList, VAButton, VAScrollView } from 'components'
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

  const bulletOne = {
    text: t('loaGate.readMore.bulletOne'),
    boldedText: ' ' + t('loaGate.readMore.or'),
  }

  return (
    <VAScrollView {...testIdProps('Sign-in: L-o-a-gate-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBody">{t('loaGate.p1')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false} a11yHint={t('loaGate.expandMsg.a11yHint')}>
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
            <TextView variant="MobileBody">{t('loaGate.readMore.itemTwo.proofOfID')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBody">{t('loaGate.readMore.itemTwo.OfferProof')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[bulletOne]} />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[t('loaGate.readMore.bulletTwo')]} />
          </Box>
        </CollapsibleView>

        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onConfirm}
            label={t('continueToSignin')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('continueToSignin.a11yHint')}
            testID={t('continueToSignin')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default LoaGate
