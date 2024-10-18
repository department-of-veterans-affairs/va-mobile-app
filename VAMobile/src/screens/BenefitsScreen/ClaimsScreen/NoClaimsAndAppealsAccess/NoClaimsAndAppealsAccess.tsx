import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ClickToCallPhoneNumber, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

let detoxTestsToRun = ['Claims', 'Appeals']

function NoClaimsAndAppealsAccess() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <VAScrollView>
      <Box mb={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold">{t('claimsAndAppeals.noClaimsAndAppealsAccess.title')}</TextView>
      </Box>
      <TextArea>
        <TextView
          variant="MobileBody"
          paragraphSpacing={true}
          accessibilityLabel={a11yLabelVA(t('claimsAndAppeals.noClaimsAndAppealsAccess.body'))}>
          {t('claimsAndAppeals.noClaimsAndAppealsAccess.body')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271001')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </TextArea>
    </VAScrollView>
  )
}

export default NoClaimsAndAppealsAccess
