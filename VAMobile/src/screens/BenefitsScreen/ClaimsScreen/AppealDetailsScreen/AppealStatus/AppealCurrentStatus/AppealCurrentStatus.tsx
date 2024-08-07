import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import _ from 'underscore'

import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import {
  AppealAOJTypes,
  AppealAOJTypesConstants,
  AppealProgramAreaTypesConstants,
  AppealStatusData,
  AppealStatusTypesConstants,
  AppealTypes,
  AppealTypesConstants,
} from 'api/types'
import { Box, TextArea, TextView, VABulletList, VABulletListText } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { camelToIndividualWords, capitalizeFirstLetter, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useExternalLink, useTheme } from 'utils/hooks'

import AppealDecision from '../AppealDecision/AppealDecision'

const { LINK_URL_DECISION_REVIEWS, LINK_URL_YOUR_CLAIMS } = getEnv()

export const getAojDescription = (aoj: AppealAOJTypes, t: TFunction): string => {
  if (aoj === AppealAOJTypesConstants.other) {
    return t('appealDetails.agencyJurisdiction')
  }

  return t(`appealDetails.${aoj}`)
}

const getHearingType = (type: string, t: TFunction): string => {
  const typeMaps: { [key: string]: string } = {
    video: t('appealDetails.videoConference'),
    travel_board: t('appealDetails.travelBoard'),
    central_office: t('appealDetails.centralOffice'),
  }

  return typeMaps[type] || type
}

type AppealStatusDisplayedData = {
  title: string
  details: Array<string>
}

const getStatusHeadingAndTitle = (
  status: AppealStatusData,
  aoj: AppealAOJTypes,
  appealType: AppealTypes,
  name: string,
  t: TFunction,
  docketName: string,
): AppealStatusDisplayedData => {
  const appealStatusDisplayedData: AppealStatusDisplayedData = { title: '', details: [] }

  const { type, details } = status

  const aojDesc = getAojDescription(aoj, t)

  switch (type) {
    case AppealStatusTypesConstants.scheduled_hearing:
      appealStatusDisplayedData.title = t('appealDetails.scheduledHearingTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.scheduledHearingDescription1', {
          hearingType: getHearingType(details.type || '', t),
          date: details.date ? formatDateMMMMDDYYYY(details.date) : '',
          location: details.location,
        }),
      ]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(t('appealDetails.note'))
        appealStatusDisplayedData.details.push(t('appealDetails.scheduledHearingDescription2'))
      }
      break
    case AppealStatusTypesConstants.pending_hearing_scheduling:
      appealStatusDisplayedData.title = t('appealDetails.pendingHearingSchedulingTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.pendingHearingSchedulingDescription1', { hearingType: getHearingType(details.type || '', t) }),
      ]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(t('appealDetails.note'))
        appealStatusDisplayedData.details.push(t('appealDetails.pendingHearingSchedulingDescription2'))
      }
      break
    case AppealStatusTypesConstants.on_docket:
      appealStatusDisplayedData.title = t('appealDetails.onDocketTitle')
      appealStatusDisplayedData.details = [t('appealDetails.onDocketDescription1')]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(t('appealDetails.note'))
        appealStatusDisplayedData.details.push(t('appealDetails.onDocketDescription2'))
      }

      break
    case AppealStatusTypesConstants.pending_certification_ssoc:
      appealStatusDisplayedData.title = t('appealDetails.pendingCertSsocTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.pendingCertSsocDescription1', {
          aojDesc,
          date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '',
        }),
        t('appealDetails.pendingCertSsocDescription2'),
        t('appealDetails.pendingCertSsocDescription3'),
      ]
      break
    case AppealStatusTypesConstants.pending_certification:
      appealStatusDisplayedData.title = t('appealDetails.pendingCertTitle')
      appealStatusDisplayedData.details = [t('appealDetails.pendingCertDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.pending_form9:
      appealStatusDisplayedData.title = t('appealDetails.pendingForm9Title')
      appealStatusDisplayedData.details = [
        t('appealDetails.pendingForm9Description1', {
          aojDesc,
          date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '',
        }),
        t('appealDetails.pendingForm9Description2'),
        t('appealDetails.pendingForm9Description3'),
        t('appealDetails.or'),
        t('appealDetails.pendingForm9Description4'),
      ]
      break
    case AppealStatusTypesConstants.pending_soc:
      appealStatusDisplayedData.title = t('appealDetails.pendingSocTitle')
      appealStatusDisplayedData.details = [t('appealDetails.pendingSocDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.stayed:
      appealStatusDisplayedData.title = t('appealDetails.stayedTitle')
      appealStatusDisplayedData.details = [t('appealDetails.stayedDescription')]
      break
    case AppealStatusTypesConstants.at_vso:
      appealStatusDisplayedData.title = t('appealDetails.atVsoTitle')
      appealStatusDisplayedData.details = [t('appealDetails.atVsoDescription', { vsoName: details.vsoName })]
      break
    case AppealStatusTypesConstants.bva_development:
      appealStatusDisplayedData.title = t('appealDetails.bvaDevTitle')
      appealStatusDisplayedData.details = [t('appealDetails.bvaDevDescription')]
      break
    case AppealStatusTypesConstants.decision_in_progress:
      appealStatusDisplayedData.title = t('appealDetails.decisionInProgressTitle')
      appealStatusDisplayedData.details = [t('appealDetails.decisionInProgressDescription1')]

      if (appealType === AppealTypesConstants.legacyAppeal) {
        appealStatusDisplayedData.details.push(t('appealDetails.decisionInProgressDescription2'))
      }
      break
    case AppealStatusTypesConstants.remand:
    case AppealStatusTypesConstants.ama_remand:
    case AppealStatusTypesConstants.bva_decision:
      appealStatusDisplayedData.title = t('appealDetails.bvaDecisionAndRemandTitle')
      appealStatusDisplayedData.details = [t('appealDetails.bvaDecisionAndRemandDescription')]
      break
    case AppealStatusTypesConstants.field_grant:
      appealStatusDisplayedData.title = t('appealDetails.fieldGrantStatusTitle', { aojDesc })
      appealStatusDisplayedData.details = [t('appealDetails.fieldGrantStatusDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.withdrawn:
      appealStatusDisplayedData.title = t('appealDetails.withdrawn')
      appealStatusDisplayedData.details = [t('appealDetails.withdrawnDescription')]
      break
    case AppealStatusTypesConstants.ftr:
      appealStatusDisplayedData.title = t('appealDetails.ftrTitle')
      appealStatusDisplayedData.details = [t('appealDetails.ftrDescription')]
      break
    case AppealStatusTypesConstants.ramp:
      appealStatusDisplayedData.title = t('appealDetails.rampStatusTitle')
      appealStatusDisplayedData.details = [t('appealDetails.rampStatusDescription')]
      break
    case AppealStatusTypesConstants.death:
      appealStatusDisplayedData.title = t('appealDetails.death')
      appealStatusDisplayedData.details = [t('appealDetails.deathDescription', { name })]
      break
    case AppealStatusTypesConstants.reconsideration:
      appealStatusDisplayedData.title = t('appealDetails.reconsideration')
      appealStatusDisplayedData.details = [t('appealDetails.reconsiderationDescription')]
      break
    case AppealStatusTypesConstants.other_close:
      appealStatusDisplayedData.title = t('appealDetails.otherClose')
      appealStatusDisplayedData.details = [t('appealDetails.otherCloseDescription')]
      break
    case AppealStatusTypesConstants.remand_ssoc:
      appealStatusDisplayedData.title = t('appealDetails.remandSsocTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.remandSsocDescription', {
          aojDesc,
          date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '',
        }),
      ]
      break
    case AppealStatusTypesConstants.merged:
      appealStatusDisplayedData.title = t('appealDetails.mergedTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.mergedDescription1'),
        t('appealDetails.mergedDescription2'),
        t('appealDetails.mergedDescription3'),
        t('appealDetails.mergedDescription4'),
      ]
      break
    case AppealStatusTypesConstants.statutory_opt_in:
      appealStatusDisplayedData.title = t('appealDetails.statutoryOptIn')
      appealStatusDisplayedData.details = [
        t('appealDetails.statutoryOptInDescription1'),
        t('appealDetails.statutoryOptInDescription2'),
        t('appealDetails.statutoryOptInDescription3'),
        t('appealDetails.statutoryOptInDescription4'),
        t('appealDetails.statutoryOptInDescription5'),
      ]
      break
    case AppealStatusTypesConstants.evidentiary_period:
      appealStatusDisplayedData.title = t('appealDetails.evidentiaryPeriodTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.evidentiaryPeriodDescription1', {
          docketName: capitalizeFirstLetter(camelToIndividualWords(docketName)),
        }),
        t('appealDetails.evidentiaryPeriodDescription2'),
        t('appealDetails.evidentiaryPeriodDescription3'),
        t('appealDetails.evidentiaryPeriodDescription4'),
        t('appealDetails.evidentiaryPeriodDescription5'),
      ]
      break
    case AppealStatusTypesConstants.post_bva_dta_decision:
      appealStatusDisplayedData.title = t('appealDetails.postBvaDtaDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [
        t('appealDetails.postBvaDtaDecisionDescription1', {
          formattedBvaDecisionDate: formatDateMMMMDDYYYY(details.bvaDecisionDate || ''),
          aojDesc,
          formattedAojDecisionDate: formatDateMMMMDDYYYY(details.aojDecisionDate || ''),
        }),
        t('appealDetails.postBvaDtaDecisionDescription2', { aojDesc }),
      ]
      break
    case AppealStatusTypesConstants.bva_decision_effectuation:
      appealStatusDisplayedData.title = t('appealDetails.bvaDecisionEffectuationTitle', { aojDesc })
      appealStatusDisplayedData.details = [
        t('appealDetails.bvaDecisionEffectuationDescription1', {
          formattedBvaDecisionDate: formatDateMMMMDDYYYY(details.bvaDecisionDate || ''),
          formattedAojDecisionDate: formatDateMMMMDDYYYY(details.aojDecisionDate || ''),
          aojDesc,
        }),
        t('appealDetails.bvaDecisionEffectuationDescription2', { aojDesc }),
      ]
      break
    case AppealStatusTypesConstants.sc_received:
      appealStatusDisplayedData.title = t('appealDetails.scReceivedTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.scReceivedDescription1', { aojDesc }),
        t('appealDetails.scReceivedNonCompDescrition'),
        t('appealDetails.scReceivedCompDescrition1', { aojDesc }),
        t('appealDetails.scReceivedCompDescrition2'),
        t('appealDetails.scReceivedCompDescrition3'),
        t('appealDetails.scReceivedCompDescrition4'),
        t('appealDetails.scReceivedCompDescrition5'),
        t('appealDetails.scReceivedCompDescrition6'),
        t('appealDetails.scReceivedDescription2'),
      ]
      break
    case AppealStatusTypesConstants.sc_decision:
      appealStatusDisplayedData.title = t('appealDetails.scDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [t('appealDetails.scDecisionDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.sc_closed:
      appealStatusDisplayedData.title = t('appealDetails.scClosedTitle')
      appealStatusDisplayedData.details = [t('appealDetails.scClosedDescription')]
      break
    case AppealStatusTypesConstants.hlr_received:
      appealStatusDisplayedData.title = t('appealDetails.hlrReceivedTitle')
      appealStatusDisplayedData.details = [
        t('appealDetails.hlrReceivedDescription1', { aojDesc }),
        t('appealDetails.hlrReceivedDescription2'),
        t('appealDetails.hlrReceivedDescription3'),
      ]
      if (details.informalConference) {
        /* CHECK IF details.informalConference */
        appealStatusDisplayedData.details.push(t('appealDetails.hlrReceivedInformalConfDescription'))
      }
      break
    case AppealStatusTypesConstants.hlr_decision:
      appealStatusDisplayedData.title = t('appealDetails.hlrDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [t('appealDetails.hlrDecisionDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.hlr_dta_error:
      appealStatusDisplayedData.title = t('appealDetails.hlrDtaErrorTitle', { aojDesc })
      appealStatusDisplayedData.details = [t('appealDetails.hlrDtaErrorDescription')]
      break
    case AppealStatusTypesConstants.hlr_closed:
      appealStatusDisplayedData.title = t('appealDetails.hlrClosedTitle')
      appealStatusDisplayedData.details = [t('appealDetails.hlrClosedDescription')]
      break
    case AppealStatusTypesConstants.remand_return:
      appealStatusDisplayedData.title = t('appealDetails.remandReturn')
      appealStatusDisplayedData.details = [t('appealDetails.remandDescription')]
      break
  }

  return appealStatusDisplayedData
}

type AppealCurrentStatusProps = {
  status: AppealStatusData
  aoj: AppealAOJTypes
  appealType: AppealTypes
  docketName: string | undefined
  programArea: string
}

function AppealCurrentStatus({ status, aoj, appealType, docketName, programArea }: AppealCurrentStatusProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const launchExternalLink = useExternalLink()
  const { data: personalInfo } = usePersonalInformation()
  const fullName = personalInfo?.fullName || ''
  const marginTop = theme.dimensions.condensedMarginBetween
  const statusHeadingAndTitle = getStatusHeadingAndTitle(
    status,
    aoj,
    appealType,
    fullName,
    t,
    docketName || 'UNDF DOCKET',
  )

  const renderStatusDetails = (): ReactElement => {
    const { details } = statusHeadingAndTitle

    switch (status.type) {
      case AppealStatusTypesConstants.on_docket:
      case AppealStatusTypesConstants.pending_hearing_scheduling:
      case AppealStatusTypesConstants.scheduled_hearing:
        if (details.length > 1) {
          return (
            <Box>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[0]}
              </TextView>
              <TextView variant="MobileBody" mt={marginTop}>
                <TextView variant="MobileBodyBold">{details[1]}</TextView>
                {details[2]}
              </TextView>
            </Box>
          )
        }
        break
      case AppealStatusTypesConstants.pending_certification_ssoc:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <Box mt={marginTop}>
              <VABulletList listOfText={[details[1], details[2]]} paragraphSpacing={true} />
            </Box>
          </Box>
        )
      case AppealStatusTypesConstants.pending_form9:
        const bulletList: Array<VABulletListText> = [
          {
            text: details[2],
            boldedText: details[3],
          },
          {
            text: details[4],
            linkToRedirect: LINK_URL_DECISION_REVIEWS,
            variant: 'MobileBodyLink',
          },
        ]
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[1]}
            </TextView>
            <Box mt={marginTop}>
              <VABulletList listOfText={bulletList} paragraphSpacing={true} />
            </Box>
          </Box>
        )
      case AppealStatusTypesConstants.merged:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView mt={marginTop} onPress={(): void => launchExternalLink(LINK_URL_YOUR_CLAIMS)}>
              <TextView variant="MobileBody">{details[1]}</TextView>
              <TextView variant="MobileBodyLink">{details[2]}</TextView>
              <TextView variant="MobileBody">{details[3]}</TextView>
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.statutory_opt_in:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView mt={marginTop} onPress={(): void => launchExternalLink(LINK_URL_YOUR_CLAIMS)}>
              <TextView variant="MobileBody">{details[1]}</TextView>
              <TextView variant="MobileBodyLink">{details[2]}</TextView>
              <TextView variant="MobileBody">{details[3]}</TextView>
              <TextView variant="MobileBodyLink" onPress={(): void => launchExternalLink(LINK_URL_DECISION_REVIEWS)}>
                {details[4]}
              </TextView>
              <TextView variant="MobileBody">.</TextView>
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.remand:
      case AppealStatusTypesConstants.ama_remand:
      case AppealStatusTypesConstants.bva_decision:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <AppealDecision
              aoj={aoj}
              boardDecision={true}
              ama={appealType === AppealTypesConstants.appeal}
              issues={status.details?.issues || []}
            />
          </Box>
        )
      case AppealStatusTypesConstants.evidentiary_period:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[1]}
            </TextView>
            <TextView variant="MobileBody">{details[2]}</TextView>
            <TextView variant="MobileBody">{details[3]}</TextView>
            <TextView variant="MobileBody">{details[4]}</TextView>
          </Box>
        )
      case AppealStatusTypesConstants.post_bva_dta_decision:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <AppealDecision
              aoj={aoj}
              boardDecision={true}
              ama={appealType === AppealTypesConstants.appeal}
              issues={status.details?.issues || []}
            />
            <TextView variant="MobileBody" mt={marginTop}>
              {details[1]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.bva_decision_effectuation:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[1]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.sc_received:
        if (programArea === AppealProgramAreaTypesConstants.compensation) {
          return (
            <Box>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[0]}
              </TextView>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[2]}
              </TextView>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[3]}
              </TextView>
              <TextView variant="MobileBody">{details[4]}</TextView>
              <TextView variant="MobileBody">{details[5]}</TextView>
              <TextView variant="MobileBody">{details[6]}</TextView>
              <TextView variant="MobileBody">{details[7]}</TextView>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[8]}
              </TextView>
            </Box>
          )
        }

        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[1]}
            </TextView>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[8]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.sc_decision:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <AppealDecision
              aoj={aoj}
              boardDecision={false}
              ama={appealType === AppealTypesConstants.appeal}
              issues={status.details?.issues || []}
            />
          </Box>
        )
      case AppealStatusTypesConstants.sc_closed:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.hlr_received:
        if (details.length > 3) {
          return (
            <Box>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[0]}
              </TextView>
              <TextView variant="MobileBody" mt={marginTop}>
                {details[3]}
              </TextView>
              <TextView variant="MobileBodyBold" mt={marginTop}>
                {details[1]}
              </TextView>
              <TextView variant="MobileBody">{details[2]}</TextView>
            </Box>
          )
        }
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView variant="MobileBodyBold" mt={marginTop}>
              {details[1]}
            </TextView>
            <TextView variant="MobileBody">{details[2]}</TextView>
          </Box>
        )
      case AppealStatusTypesConstants.hlr_decision:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <AppealDecision
              aoj={aoj}
              boardDecision={false}
              ama={appealType === AppealTypesConstants.appeal}
              issues={status.details?.issues || []}
            />
          </Box>
        )
      case AppealStatusTypesConstants.hlr_dta_error:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.hlr_closed:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
          </Box>
        )
      case AppealStatusTypesConstants.remand_return:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
          </Box>
        )
    }

    return (
      <Box>
        {_.map(details, (detail, index) => {
          return (
            <TextView variant="MobileBody" mt={marginTop} key={index}>
              {detail}
            </TextView>
          )
        })}
      </Box>
    )
  }

  return (
    <TextArea>
      <TextView variant="BitterBoldHeading" accessibilityRole="header">
        {t('appealDetails.currentStatus')}
      </TextView>
      <TextView variant="MobileBodyBold" mt={marginTop} accessibilityRole="header">
        {statusHeadingAndTitle.title}
      </TextView>
      {renderStatusDetails()}
    </TextArea>
  )
}

export default AppealCurrentStatus
