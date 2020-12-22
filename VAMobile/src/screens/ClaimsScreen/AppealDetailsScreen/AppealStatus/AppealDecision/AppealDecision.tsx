import React, { FC } from 'react'

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

  const allowedIssues = issues.filter((issue) => issue.disposition === 'allowed')
  const deniedIssues = issues.filter((issue) => issue.disposition === 'denied')
  const remandIssues = issues.filter((issue) => issue.disposition === 'remand')

  const pluralize = {
    allowed: allowedIssues.length > 1 ? 'issues' : 'issue',
    denied: deniedIssues.length > 1 ? 'issues' : 'issue',
    remand: remandIssues.length > 1 ? 'these issues' : 'this issue',
  }

  const aojDescription = getAojDescription(aoj, t)

  const getIssuesListOfText = (issuesList: Array<AppealStatusDetailsIssue>): Array<string> => {
    return _.map(issuesList, (issue) => {
      return issue.description
    })
  }

  let allowedBlock = null
  let deniedBlock = null
  let remandBlock = null

  if (allowedIssues.length > 0) {
    allowedBlock = (
      <Box>
        <TextView variant="MobileBodyBold">Granted</TextView>
        <TextView variant="MobileBody">
          The {boardDecision ? 'judge' : 'reviewer'} granted the following {pluralize.allowed}:
        </TextView>
        <VABulletList listOfText={getIssuesListOfText(allowedIssues)} />
      </Box>
    )
  }

  if (deniedIssues.length > 0) {
    deniedBlock = (
      <Box>
        <TextView variant="MobileBodyBold">Denied</TextView>
        <TextView variant="MobileBody">
          The {boardDecision ? 'judge' : 'reviewer'} denied the following {pluralize.denied}:
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
          The judge is sending {pluralize.remand} back to the {aojDescription} to
          {ama ? 'correct an error' : 'gather more evidence or to fix a mistake before deciding whether to grant or deny'}
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
