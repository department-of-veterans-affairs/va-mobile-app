import React from 'react'
import { useTranslation } from 'react-i18next'

import { AccordionCollapsible, Box, TextArea, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type AppealsIssuesProps = {
  issues: Array<string>
}

function AppealIssues({ issues }: AppealsIssuesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box>
      <AccordionCollapsible
        header={
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.issuesDifferentHeader')}
          </TextView>
        }
        expandedContent={
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('appealDetails.issuesDifferentBody'))}
            mt={theme.dimensions.condensedMarginBetween}>
            {t('appealDetails.issuesDifferentBody')}
          </TextView>
        }
      />
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.currentlyOnAppeal')}
          </TextView>
          <VABulletList listOfText={issues} />
        </TextArea>
      </Box>
    </Box>
  )
}

export default AppealIssues
