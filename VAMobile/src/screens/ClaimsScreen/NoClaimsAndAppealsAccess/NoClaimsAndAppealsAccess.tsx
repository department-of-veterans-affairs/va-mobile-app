import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC } from 'react'

const NoClaimsAndAppealsAccess: FC = () => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <VAScrollView {...testIdProps('Claims: No-claims-and-appeals-page')}>
      <Box my={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="BitterBoldHeading" color={'primaryTitle'}>
          {t('claimsAndAppeals.noClaimsAndAppealsAccess.title')}
        </TextView>
      </Box>
      <TextArea>
        <TextView {...testIdProps(t('claimsAndAppeals.noClaimsAndAppealsAccess.body.a11yLabel'))}>{t('claimsAndAppeals.noClaimsAndAppealsAccess.body')}</TextView>
        <ClickToCallPhoneNumber phone={t('claimDetails.VANumber')} displayedText={t('claimDetails.VANumberDisplayed')} />
      </TextArea>
    </VAScrollView>
  )
}

export default NoClaimsAndAppealsAccess
