import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC } from 'react'

export type SplashScreenProps = Record<string, unknown>
const NoClaimsAndAppealsAccess: FC<SplashScreenProps> = () => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <VAScrollView>
      <Box my={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="BitterBoldHeading">{t('claimsAndAppeals.noClaimsAndAppealsAccess.title')}</TextView>
      </Box>
      <TextArea>
        <TextView>{t('claimsAndAppeals.noClaimsAndAppealsAccess.body')}</TextView>
        <ClickToCallPhoneNumber phone={t('claimDetails.VANumber')} displayedText={t('claimDetails.VANumberDisplayed')} />
      </TextArea>
    </VAScrollView>
  )
}

export default NoClaimsAndAppealsAccess
