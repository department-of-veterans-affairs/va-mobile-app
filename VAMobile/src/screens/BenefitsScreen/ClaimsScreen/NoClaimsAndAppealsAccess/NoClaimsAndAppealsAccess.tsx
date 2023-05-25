import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'styled-components'

const NoClaimsAndAppealsAccess: FC = () => {
  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <VAScrollView {...testIdProps('Claims: No-claims-and-appeals-page')}>
      <Box my={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="BitterBoldHeading">{t('claimsAndAppeals.noClaimsAndAppealsAccess.title')}</TextView>
      </Box>
      <TextArea>
        <TextView variant="MobileBody" {...testIdProps(t('claimsAndAppeals.noClaimsAndAppealsAccess.body.a11yLabel'))}>
          {t('claimsAndAppeals.noClaimsAndAppealsAccess.body')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
      </TextArea>
    </VAScrollView>
  )
}

export default NoClaimsAndAppealsAccess
