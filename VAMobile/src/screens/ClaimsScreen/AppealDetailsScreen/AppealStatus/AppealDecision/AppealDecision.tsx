import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { AppealAOJTypes, AppealStatusDetailsIssue } from 'store/api/types'
import { Box, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAojDescription } from '../AppealCurrentStatus/AppealCurrentStatus'
import { useTranslation } from 'utils/hooks'

type AppealDecisionProps = {
  issues: Array<AppealStatusDetailsIssue>
  aoj: AppealAOJTypes
  ama: boolean
  boardDecision: boolean
}

const AppealDecision: FC<AppealDecisionProps> = ({ issues, aoj, ama, boardDecision }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)

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

  const aojDescription = getAojDescription(aoj, t)

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
      <Box>
        <TextView variant="MobileBodyBold">{header}</TextView>
        <TextView variant="MobileBody">{subText}</TextView>
        <VABulletList listOfText={getIssuesListOfText(specificIssues)} />
      </Box>
    )
  }

  let allowedBlock = null
  let deniedBlock = null
  let remandBlock = null

  const judgeOrReviewer = boardDecision ? t('appealDetails.judge') : t('appealDetails.reviewer')

  if (allowedIssues.length > 0) {
    allowedBlock = (
      <Box>
        <TextView variant="MobileBodyBold">{t('appealDetails.granted')}</TextView>
        <TextView variant="MobileBody">
          {t('appealDetails.personGrantedOrDenied', { person: judgeOrReviewer, action: t('appealDetails.granted').toLowerCase(), pluralizedIssue: pluralize.allowed })}
        </TextView>
        <VABulletList listOfText={getIssuesListOfText(allowedIssues)} />
      </Box>
    )
  }

  if (deniedIssues.length > 0) {
    deniedBlock = (
      <Box>
        <TextView variant="MobileBodyBold">{t('appealDetails.denied')}</TextView>
        <TextView variant="MobileBody">
          {t('appealDetails.personGrantedOrDenied', { person: judgeOrReviewer, action: t('appealDetails.denied').toLowerCase(), pluralizedIssue: pluralize.denied })}
        </TextView>
        <VABulletList listOfText={getIssuesListOfText(deniedIssues)} />
      </Box>
    )
  }

  if (remandIssues.length > 0) {
    remandBlock = (
      <Box>
        <TextView variant="MobileBodyBold">Remand</TextView>
        <TextView variant="MobileBody">
          {t('appealDetails.judgeSendingBack', {
            pluralizedIssue: pluralize.remand,
            aojDesc: aojDescription,
            action: ama ? t('appealDetails.correctAnError') : t('appealDetails.gatherMoreEvidence'),
          })}
        </TextView>
        <VABulletList listOfText={getIssuesListOfText(remandIssues)} />
      </Box>
    )
  }

  return (
    <Box>
      {allowedBlock}
      {allowedBlock && boardDecision && (
        <TextView variant="MobileBody">
          If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months.
        </TextView>
      )}
      {deniedBlock}
      {remandBlock}
      {remandBlock && ama && (
        <TextView variant="MobileBody">After the {aojDescription} has completed the judge’s instructions to correct the error, they will make a new decision.</TextView>
      )}
      <TextView variant="MobileBody">Please see your decision for more details.</TextView>
    </Box>
  )
}

export default AppealDecision
