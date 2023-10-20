import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, CollapsibleView, FullScreenSubtask, TextView, TextViewProps, VABulletList, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useNavigation } from '@react-navigation/native'
import { useStartAuth } from 'utils/hooks/auth'
import { useTheme } from 'utils/hooks'

type LoaGateProps = Record<string, unknown>

const LoaGate: FC<LoaGateProps> = ({}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const startAuth = useStartAuth()
  const navigation = useNavigation()

  const bulletOne = {
    text: t('loaGate.readMore.bulletOne'),
    boldedText: ' ' + t('loaGate.readMore.or'),
    a11yLabel: t('loaGate.readMore.bulletOne.a11y'),
  }

  const bodyTextProps: TextViewProps = {
    variant: 'MobileBody',
  }

  const titleTextProps: TextViewProps = {
    variant: 'MobileBodyBold',
  }

  return (
    <FullScreenSubtask leftButtonText={t('close')} title={t('signin')} onLeftButtonPress={navigation.goBack} showCrisisLineCta={true}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView paragraphSpacing={true} {...bodyTextProps}>
          {t('loaGate.p1')}
        </TextView>
        <TextView paragraphSpacing={true} {...bodyTextProps}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false}>
          <TextView paragraphSpacing={true} {...bodyTextProps}>
            {t('loaGate.readMore.p1')}
          </TextView>
          <TextView {...titleTextProps}>{t('loaGate.readMore.p2')}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>
              {t('loaGate.readMore.itemOne')}
              <TextView {...titleTextProps}>{t('and')}</TextView>
            </TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>{t('loaGate.readMore.itemTwo.proofOfID')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>{t('loaGate.readMore.itemTwo.OfferProof')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[bulletOne, { text: t('loaGate.readMore.bulletTwo') }]} />
          </Box>
        </CollapsibleView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton onPress={startAuth} label={t('continueToSignin')} buttonType={ButtonTypesConstants.buttonPrimary} testID={t('continueToSignin')} />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default LoaGate
