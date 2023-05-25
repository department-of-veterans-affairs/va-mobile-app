import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, CollapsibleView, CrisisLineCta, FullScreenSubtask, TextView, TextViewProps, VABulletList, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'

import { useNavigation } from '@react-navigation/native'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type LoaGateProps = Record<string, unknown>

const LoaGate: FC<LoaGateProps> = ({}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const navigation = useNavigation()
  const onConfirm = navigateTo('WebviewLogin')
  const onCrisisLine = navigateTo('VeteransCrisisLine')

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
    <FullScreenSubtask leftButtonText={t('back')} onLeftButtonPress={navigation.goBack}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView {...bodyTextProps}>{t('loaGate.p1')}</TextView>
        <TextView {...bodyTextProps} my={theme.dimensions.standardMarginBetween}>
          {t('loaGate.p2')}
        </TextView>
        <CollapsibleView text={t('loaGate.expandMsg')} showInTextArea={false} a11yHint={t('loaGate.expandMsg.a11yHint')}>
          <TextView {...bodyTextProps}>{t('loaGate.readMore.p1')}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...titleTextProps}>{t('loaGate.readMore.p2')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>
              {t('loaGate.readMore.itemOne')}
              <TextView {...titleTextProps}>{t('loaGate.readMore.itemOne.and')}</TextView>
            </TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>{t('loaGate.readMore.itemTwo.proofOfID')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView {...bodyTextProps}>{t('loaGate.readMore.itemTwo.OfferProof')}</TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[bulletOne]} />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList listOfText={[{ text: t('loaGate.readMore.bulletTwo') }]} />
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
    </FullScreenSubtask>
  )
}

export default LoaGate
