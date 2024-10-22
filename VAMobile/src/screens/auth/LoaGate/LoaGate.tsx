import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, CollapsibleView, FullScreenSubtask, TextView, TextViewProps, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { useStartAuth } from 'utils/hooks/auth'

type LoaGateProps = Record<string, unknown>

function LoaGate({}: LoaGateProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const startAuth = useStartAuth()
  const navigation = useNavigation()

  const bulletOne = {
    text: t('loaGate.readMore.bulletOne'),
    boldedText: ' ' + t('loaGate.readMore.or'),
  }

  const bodyTextProps: TextViewProps = {
    variant: 'MobileBody',
  }

  const titleTextProps: TextViewProps = {
    variant: 'MobileBodyBold',
  }

  return (
    <FullScreenSubtask
      leftButtonText={t('close')}
      title={t('signin')}
      onLeftButtonPress={navigation.goBack}
      showCrisisLineButton={true}>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <TextView mb={theme.dimensions.standardMarginBetween} {...bodyTextProps}>
          {t('loaGate.p1')}
        </TextView>
        <TextView mb={theme.dimensions.standardMarginBetween} {...bodyTextProps}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false} testID="loaGateExpandMsgID">
          <TextView my={theme.dimensions.standardMarginBetween} {...bodyTextProps}>
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
          <Button onPress={startAuth} label={t('continueToSignin')} testID={t('continueToSignin')} />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default LoaGate
