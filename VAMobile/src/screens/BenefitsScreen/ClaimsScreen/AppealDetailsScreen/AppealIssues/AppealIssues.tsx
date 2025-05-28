import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AppealIssue, AppealIssueLastAction } from 'api/types'
import { Box, TextArea, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type AppealsIssuesProps = {
  issues: Array<AppealIssue>
}

function AppealIssues({ issues }: AppealsIssuesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const issuesByStatus = useMemo(() => {
    const byStatus: {
      open: AppealIssue[]
      remand: AppealIssue[]
      granted: AppealIssue[]
      denied: AppealIssue[]
      withdrawn: AppealIssue[]
    } = {
      open: [],
      remand: [],
      granted: [],
      denied: [],
      withdrawn: [],
    }

    if (issues.length) {
      issues.forEach((issue) => {
        switch (issue.lastAction) {
          case AppealIssueLastAction.fieldGrant: {
            byStatus.granted.push(issue)
            break
          }
          case AppealIssueLastAction.withdrawn: {
            byStatus.withdrawn.push(issue)
            break
          }
          case AppealIssueLastAction.allowed: {
            byStatus.granted.push(issue)
            break
          }
          case AppealIssueLastAction.denied: {
            byStatus.denied.push(issue)
            break
          }
          case AppealIssueLastAction.remand: {
            byStatus.remand.push(issue)
            break
          }
          case AppealIssueLastAction.cavcRemand: {
            byStatus.remand.push(issue)
            break
          }
          default:
            // any issue with a lastAction of null is considered open
            byStatus.open.push(issue)
            break
        }
      })
    }
    return byStatus
  }, [issues])

  const renderSections = (items: Array<AppealIssue>, title: string) => {
    if (!items.length) {
      return null
    }
    const listsOfIssues = items.map((item) => item.description)
    return (
      <>
        <TextView
          variant="vadsFontHeadingXsmall"
          accessibilityRole="header"
          mt={theme.dimensions.condensedMarginBetween}>
          {title}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween} ml={theme.dimensions.gutter}>
          <VABulletList listOfText={listsOfIssues} />
        </Box>
      </>
    )
  }

  const showCurrentlOnAppeal = issuesByStatus.open.length || issuesByStatus.remand.length
  const showClosed = issuesByStatus.granted.length || issuesByStatus.denied.length || issuesByStatus.withdrawn.length
  return (
    <>
      {showCurrentlOnAppeal ? (
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.currentlyOnAppeal')}
          </TextView>
          {renderSections(issuesByStatus.open, t('appealDetails.open'))}
          {renderSections(issuesByStatus.remand, t('appealDetails.remand'))}
        </TextArea>
      ) : null}
      {showClosed ? (
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('appealDetails.closed')}
            </TextView>
            {renderSections(issuesByStatus.granted, t('appealDetails.granted'))}
            {renderSections(issuesByStatus.denied, t('appealDetails.denied'))}
            {renderSections(issuesByStatus.withdrawn, t('appealDetails.withdrawnText'))}
          </TextArea>
        </Box>
      ) : null}
    </>
  )
}

export default AppealIssues
