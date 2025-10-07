import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AppealIssue, AppealIssueLastAction, AppealTypes } from 'api/types'
import { AppealTypesDisplayNames } from 'api/types/ClaimsAndAppealsData'
import { AccordionCollapsible, Box, BoxProps, TextArea, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type AppealIssuesProps = {
  appealType: AppealTypes
  issues: Array<AppealIssue>
}

function AppealIssues({ appealType, issues }: AppealIssuesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const appealTypeName = appealType.toLowerCase().includes('appeal')
    ? t(AppealTypesDisplayNames[appealType])
    : `your ${t(AppealTypesDisplayNames[appealType])}`

  const issuesByStatus = useMemo(() => {
    const byStatus: {
      underConsideration: AppealIssue[]
      remand: AppealIssue[]
      granted: AppealIssue[]
      denied: AppealIssue[]
      withdrawn: AppealIssue[]
    } = {
      underConsideration: [],
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
            // any issue with a lastAction of null is considered under consideration("open")
            byStatus.underConsideration.push(issue)
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
    const itemsWithNullDescription = items.filter((item) => item.description === null)
    const itemsWithDescriptions = items.filter(
      (item): item is AppealIssue & { description: string } => item.description !== null,
    )
    const listOfIssues = itemsWithDescriptions.map((item) => item.description)

    // Add one item that informs the user of how many issues have null descriptions
    // This will display one list item per status (remand, granted, etc.)
    if (itemsWithNullDescription.length > 0) {
      const translationKey =
        itemsWithNullDescription.length === 1 ? 'appealDetails.unableToShowIssue' : 'appealDetails.unableToShowIssues'

      listOfIssues.push(
        t(translationKey, {
          count: itemsWithNullDescription.length,
          appealType: appealTypeName,
        }),
      )
    }
    return (
      <>
        <TextView
          variant="vadsFontHeadingXsmall"
          accessibilityRole="header"
          mt={theme.dimensions.condensedMarginBetween}>
          {title}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween} ml={theme.dimensions.gutter}>
          <VABulletList listOfText={listOfIssues} />
        </Box>
      </>
    )
  }

  const showCurrentlyOnAppeal = issuesByStatus.underConsideration.length || issuesByStatus.remand.length
  const showClosed = issuesByStatus.granted.length || issuesByStatus.denied.length || issuesByStatus.withdrawn.length

  const additionalBorderStyles: BoxProps = {
    borderBottomWidth: undefined,
    borderBottomColor: undefined,
  }
  return (
    <>
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
      {showCurrentlyOnAppeal ? (
        <TextArea
          borderBoxStyle={{
            ...additionalBorderStyles,
            borderTopWidth: undefined,
            borderTopColor: undefined,
          }}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.currentlyOnAppeal')}
          </TextView>
          {renderSections(issuesByStatus.underConsideration, t('appealDetails.underConsideration'))}
          {renderSections(issuesByStatus.remand, t('appealDetails.remand'))}
        </TextArea>
      ) : null}
      {showClosed ? (
        <TextArea borderBoxStyle={additionalBorderStyles}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.closed')}
          </TextView>
          {renderSections(issuesByStatus.granted, t('appealDetails.granted'))}
          {renderSections(issuesByStatus.denied, t('appealDetails.denied'))}
          {renderSections(issuesByStatus.withdrawn, t('appealDetails.withdrawnText'))}
        </TextArea>
      ) : null}
    </>
  )
}

export default AppealIssues
