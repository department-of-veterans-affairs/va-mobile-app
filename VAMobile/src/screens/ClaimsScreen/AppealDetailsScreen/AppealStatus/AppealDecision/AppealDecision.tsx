import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { AppealAOJTypes, AppealStatusDetailsIssue } from 'store/api/types'
import { Box, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAojDescription } from '../AppealCurrentStatus/AppealCurrentStatus'
import { useTheme, useTranslation } from 'utils/hooks'

type AppealDecisionProps = {
  issues: Array<AppealStatusDetailsIssue>
  aoj: AppealAOJTypes
  ama: boolean
  boardDecision: boolean
}

const AppealDecision: FC<AppealDecisionProps> = ({ issues, aoj, ama, boardDecision }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  const getIssuesByDisposition = (stringToCompare: string): Array<AppealStatusDetailsIssue> => {
    return issues.filter((issue) => issue.disposition === stringToCompare)
  }

  const allowedIssues = getIssuesByDisposition('allowed')
  const deniedIssues = getIssuesByDisposition('denied')
  const remandIssues = getIssuesByDisposition('remand')

  const pluralize = {
    allowed: allowedIssues.length > 1 ? t('appealDetails.issues') : t('appealDetails.issue'),
    denied: deniedIssues.length > 1 ? t('appealDetails.issues') : t('appealDetails.issue'),
    remand: remandIssues.length > 1 ? t('appealDetails.theseIssues') : t('appealDetails.thisIssue'),
  }

  const aojDesc = getAojDescription(aoj, t)

  const getIssuesListOfText = (issuesList: Array<AppealStatusDetailsIssue>): Array<string> => {
    return _.map(issuesList, (issue) => {
      return issue.description
    })
  }

  const getSpecificIssuesBlock = (header: string, subText: string, specificIssues: Array<AppealStatusDetailsIssue>): ReactElement => {
    if (specificIssues.length === 0) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" color={'primaryTitle'}>
          {header}
        </TextView>
        <TextView variant="MobileBody">{subText}</TextView>
        <VABulletList listOfText={getIssuesListOfText(specificIssues)} />
      </Box>
    )
  }

  const judgeOrReviewer = boardDecision ? t('appealDetails.judge') : t('appealDetails.reviewer')

  const allowedBlock = getSpecificIssuesBlock(
    t('appealDetails.granted'),
    t('appealDetails.personGrantedOrDenied', { person: judgeOrReviewer, action: t('appealDetails.granted').toLowerCase(), pluralizedIssue: pluralize.allowed }),
    allowedIssues,
  )

  const deniedBlock = getSpecificIssuesBlock(
    t('appealDetails.denied'),
    t('appealDetails.personGrantedOrDenied', { person: judgeOrReviewer, action: t('appealDetails.denied').toLowerCase(), pluralizedIssue: pluralize.denied }),
    deniedIssues,
  )

  const remandBlock = getSpecificIssuesBlock(
    t('appealDetails.remand'),
    t('appealDetails.judgeSendingBack', { pluralizedIssue: pluralize.remand, aojDesc, action: ama ? t('appealDetails.correctAnError') : t('appealDetails.gatherMoreEvidence') }),
    remandIssues,
  )

  return (
    <Box>
      {allowedBlock}
      {allowedIssues.length > 0 && boardDecision && (
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('appealDetails.ifThisChangesRating')}
        </TextView>
      )}
      {deniedBlock}
      {remandBlock}
      {remandIssues.length > 0 && ama && (
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('appealDetails.willMakeNewDecision', { aojDesc })}
        </TextView>
      )}
      <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {t('appealDetails.pleaseSeeYourDecision')}
      </TextView>
    </Box>
  )
}

export default AppealDecision
