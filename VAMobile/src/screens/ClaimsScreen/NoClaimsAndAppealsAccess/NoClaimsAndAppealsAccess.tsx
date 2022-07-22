import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

const NoClaimsAndAppealsAccess: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation([NAMESPACE.CLAIMS, NAMESPACE.COMMON])

  return (
    <VAScrollView {...testIdProps('Claims: No-claims-and-appeals-page')}>
      <Box my={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="BitterBoldHeading">{t('claims:claimsAndAppeals.noClaimsAndAppealsAccess.title')}</TextView>
      </Box>
      <TextArea>
        <TextView variant="MobileBody" {...testIdProps(t('claims:claimsAndAppeals.noClaimsAndAppealsAccess.body.a11yLabel'))}>
          {t('claims:claimsAndAppeals.noClaimsAndAppealsAccess.body')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('common:8008271000')} displayedText={t('common:8008271000.displayText')} />
      </TextArea>
    </VAScrollView>
  )
}

export default NoClaimsAndAppealsAccess
