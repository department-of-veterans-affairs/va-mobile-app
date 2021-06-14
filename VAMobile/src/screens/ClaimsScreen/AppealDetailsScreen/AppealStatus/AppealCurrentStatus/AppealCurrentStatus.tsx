import { TFunction } from 'i18next'
import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import {
  AppealAOJTypes,
  AppealAOJTypesConstants,
  AppealProgramAreaTypesConstants,
  AppealStatusData,
  AppealStatusTypesConstants,
  AppealTypes,
  AppealTypesConstants,
} from 'store/api/types'
import { Box, TextArea, TextView, VABulletList, VABulletListText } from 'components'
import { Linking } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { camelToIndividualWords, capitalizeFirstLetter, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useSelector } from 'react-redux'
import { useTheme, useTranslation } from 'utils/hooks'
import AppealDecision from '../AppealDecision/AppealDecision'
import getEnv from 'utils/env'

const { LINK_URL_DECISION_REVIEWS, LINK_URL_YOUR_CLAIMS } = getEnv()

export const getAojDescription = (aoj: AppealAOJTypes, translation: TFunction): string => {
  if (aoj === AppealAOJTypesConstants.other) {
    return translation('appealDetails.agencyJurisdiction')
  }

  return translation(`appealDetails.${aoj}`)
}

const getHearingType = (type: string, translation: TFunction): string => {
  const typeMaps: { [key: string]: string } = {
    video: translation('appealDetails.videoConference'),
    travel_board: translation('appealDetails.travelBoard'),
    central_office: translation('appealDetails.centralOffice'),
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
  translation: TFunction,
  docketName: string,
): AppealStatusDisplayedData => {
  const appealStatusDisplayedData: AppealStatusDisplayedData = { title: '', details: [] }

  const { type, details } = status

  const aojDesc = getAojDescription(aoj, translation)

  switch (type) {
    case AppealStatusTypesConstants.scheduled_hearing:
      appealStatusDisplayedData.title = translation('appealDetails.scheduledHearingTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.scheduledHearingDescription1', {
          hearingType: getHearingType(details.type || '', translation),
          date: details.date ? formatDateMMMMDDYYYY(details.date) : '',
          location: details.location,
        }),
      ]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(translation('appealDetails.note'))
        appealStatusDisplayedData.details.push(translation('appealDetails.scheduledHearingDescription2'))
      }
      break
    case AppealStatusTypesConstants.pending_hearing_scheduling:
      appealStatusDisplayedData.title = translation('appealDetails.pendingHearingSchedulingTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.pendingHearingSchedulingDescription1', { hearingType: getHearingType(details.type || '', translation) })]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(translation('appealDetails.note'))
        appealStatusDisplayedData.details.push(translation('appealDetails.pendingHearingSchedulingDescription2'))
      }
      break
    case AppealStatusTypesConstants.on_docket:
      appealStatusDisplayedData.title = translation('appealDetails.onDocketTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.onDocketDescription1')]

      if (appealType === AppealTypesConstants.appeal) {
        appealStatusDisplayedData.details.push(translation('appealDetails.note'))
        appealStatusDisplayedData.details.push(translation('appealDetails.onDocketDescription2'))
      }

      break
    case AppealStatusTypesConstants.pending_certification_ssoc:
      appealStatusDisplayedData.title = translation('appealDetails.pendingCertSsocTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.pendingCertSsocDescription1', {
          aojDesc,
          date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '',
        }),
        translation('appealDetails.pendingCertSsocDescription2'),
        translation('appealDetails.pendingCertSsocDescription3'),
      ]
      break
    case AppealStatusTypesConstants.pending_certification:
      appealStatusDisplayedData.title = translation('appealDetails.pendingCertTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.pendingCertDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.pending_form9:
      appealStatusDisplayedData.title = translation('appealDetails.pendingForm9Title')
      appealStatusDisplayedData.details = [
        translation('appealDetails.pendingForm9Description1', { aojDesc, date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '' }),
        translation('appealDetails.pendingForm9Description2'),
        translation('appealDetails.pendingForm9Description3'),
        translation('appealDetails.or'),
        translation('appealDetails.pendingForm9Description4'),
      ]
      break
    case AppealStatusTypesConstants.pending_soc:
      appealStatusDisplayedData.title = translation('appealDetails.pendingSocTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.pendingSocDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.stayed:
      appealStatusDisplayedData.title = translation('appealDetails.stayedTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.stayedDescription')]
      break
    case AppealStatusTypesConstants.at_vso:
      appealStatusDisplayedData.title = translation('appealDetails.atVsoTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.atVsoDescription', { vsoName: details.vsoName })]
      break
    case AppealStatusTypesConstants.bva_development:
      appealStatusDisplayedData.title = translation('appealDetails.bvaDevTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.bvaDevDescription')]
      break
    case AppealStatusTypesConstants.decision_in_progress:
      appealStatusDisplayedData.title = translation('appealDetails.decisionInProgressTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.decisionInProgressDescription1')]

      if (appealType === AppealTypesConstants.legacyAppeal) {
        appealStatusDisplayedData.details.push(translation('appealDetails.decisionInProgressDescription2'))
      }
      break
    case AppealStatusTypesConstants.remand:
    case AppealStatusTypesConstants.ama_remand:
    case AppealStatusTypesConstants.bva_decision:
      appealStatusDisplayedData.title = translation('appealDetails.bvaDecisionAndRemandTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.bvaDecisionAndRemandDescription')]
      break
    case AppealStatusTypesConstants.field_grant:
      appealStatusDisplayedData.title = translation('appealDetails.fieldGrantStatusTitle', { aojDesc })
      appealStatusDisplayedData.details = [translation('appealDetails.fieldGrantStatusDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.withdrawn:
      appealStatusDisplayedData.title = translation('appealDetails.withdrawn')
      appealStatusDisplayedData.details = [translation('appealDetails.withdrawnDescription')]
      break
    case AppealStatusTypesConstants.ftr:
      appealStatusDisplayedData.title = translation('appealDetails.ftrTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.ftrDescription')]
      break
    case AppealStatusTypesConstants.ramp:
      appealStatusDisplayedData.title = translation('appealDetails.rampStatusTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.rampStatusDescription')]
      break
    case AppealStatusTypesConstants.death:
      appealStatusDisplayedData.title = translation('appealDetails.death')
      appealStatusDisplayedData.details = [translation('appealDetails.deathDescription', { name })]
      break
    case AppealStatusTypesConstants.reconsideration:
      appealStatusDisplayedData.title = translation('appealDetails.reconsideration')
      appealStatusDisplayedData.details = [translation('appealDetails.reconsiderationDescription')]
      break
    case AppealStatusTypesConstants.other_close:
      appealStatusDisplayedData.title = translation('appealDetails.otherClose')
      appealStatusDisplayedData.details = [translation('appealDetails.otherCloseDescription')]
      break
    case AppealStatusTypesConstants.remand_ssoc:
      appealStatusDisplayedData.title = translation('appealDetails.remandSsocTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.remandSsocDescription', { aojDesc, date: details.lastSocDate ? formatDateMMMMDDYYYY(details.lastSocDate) : '' }),
      ]
      break
    case AppealStatusTypesConstants.merged:
      appealStatusDisplayedData.title = translation('appealDetails.mergedTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.mergedDescription1'),
        translation('appealDetails.mergedDescription2'),
        translation('appealDetails.mergedDescription3'),
        translation('appealDetails.mergedDescription4'),
      ]
      break
    case AppealStatusTypesConstants.statutory_opt_in:
      appealStatusDisplayedData.title = translation('appealDetails.statutoryOptIn')
      appealStatusDisplayedData.details = [
        translation('appealDetails.statutoryOptInDescription1'),
        translation('appealDetails.statutoryOptInDescription2'),
        translation('appealDetails.statutoryOptInDescription3'),
        translation('appealDetails.statutoryOptInDescription4'),
        translation('appealDetails.statutoryOptInDescription5'),
      ]
      break
    case AppealStatusTypesConstants.evidentiary_period:
      appealStatusDisplayedData.title = translation('appealDetails.evidentiaryPeriodTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.evidentiaryPeriodDescription1', { docketName: capitalizeFirstLetter(camelToIndividualWords(docketName)) }),
        translation('appealDetails.evidentiaryPeriodDescription2'),
        translation('appealDetails.evidentiaryPeriodDescription3'),
        translation('appealDetails.evidentiaryPeriodDescription4'),
        translation('appealDetails.evidentiaryPeriodDescription5'),
      ]
      break
    case AppealStatusTypesConstants.post_bva_dta_decision:
      appealStatusDisplayedData.title = translation('appealDetails.postBvaDtaDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [
        translation('appealDetails.postBvaDtaDecisionDescription1', {
          formattedBvaDecisionDate: formatDateMMMMDDYYYY(details.bvaDecisionDate || ''),
          aojDesc,
          formattedAojDecisionDate: formatDateMMMMDDYYYY(details.aojDecisionDate || ''),
        }),
        translation('appealDetails.postBvaDtaDecisionDescription2', { aojDesc }),
      ]
      break
    case AppealStatusTypesConstants.bva_decision_effectuation:
      appealStatusDisplayedData.title = translation('appealDetails.bvaDecisionEffectuationTitle', { aojDesc })
      appealStatusDisplayedData.details = [
        translation('appealDetails.bvaDecisionEffectuationDescription1', {
          formattedBvaDecisionDate: formatDateMMMMDDYYYY(details.bvaDecisionDate || ''),
          formattedAojDecisionDate: formatDateMMMMDDYYYY(details.aojDecisionDate || ''),
          aojDesc,
        }),
        translation('appealDetails.bvaDecisionEffectuationDescription2', { aojDesc }),
      ]
      break
    case AppealStatusTypesConstants.sc_received:
      appealStatusDisplayedData.title = translation('appealDetails.scReceivedTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.scReceivedDescription1', { aojDesc }),
        translation('appealDetails.scReceivedNonCompDescrition'),
        translation('appealDetails.scReceivedCompDescrition1', { aojDesc }),
        translation('appealDetails.scReceivedCompDescrition2'),
        translation('appealDetails.scReceivedCompDescrition3'),
        translation('appealDetails.scReceivedCompDescrition4'),
        translation('appealDetails.scReceivedCompDescrition5'),
        translation('appealDetails.scReceivedCompDescrition6'),
        translation('appealDetails.scReceivedDescription2'),
      ]
      break
    case AppealStatusTypesConstants.sc_decision:
      appealStatusDisplayedData.title = translation('appealDetails.scDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [translation('appealDetails.scDecisionDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.sc_closed:
      appealStatusDisplayedData.title = translation('appealDetails.scClosedTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.scClosedDescription')]
      break
    case AppealStatusTypesConstants.hlr_received:
      appealStatusDisplayedData.title = translation('appealDetails.hlrReceivedTitle')
      appealStatusDisplayedData.details = [
        translation('appealDetails.hlrReceivedDescription1', { aojDesc }),
        translation('appealDetails.hlrReceivedDescription2'),
        translation('appealDetails.hlrReceivedDescription3'),
      ]
      if (details.informalConference) {
        /* CHECK IF details.informalConference */
        appealStatusDisplayedData.details.push(translation('appealDetails.hlrReceivedInformalConfDescription'))
      }
      break
    case AppealStatusTypesConstants.hlr_decision:
      appealStatusDisplayedData.title = translation('appealDetails.hlrDecisionTitle', { aojDesc })
      appealStatusDisplayedData.details = [translation('appealDetails.hlrDecisionDescription', { aojDesc })]
      break
    case AppealStatusTypesConstants.hlr_dta_error:
      appealStatusDisplayedData.title = translation('appealDetails.hlrDtaErrorTitle', { aojDesc })
      appealStatusDisplayedData.details = [translation('appealDetails.hlrDtaErrorDescription')]
      break
    case AppealStatusTypesConstants.hlr_closed:
      appealStatusDisplayedData.title = translation('appealDetails.hlrClosedTitle')
      appealStatusDisplayedData.details = [translation('appealDetails.hlrClosedDescription')]
      break
    case AppealStatusTypesConstants.remand_return:
      appealStatusDisplayedData.title = translation('appealDetails.remandReturn')
      appealStatusDisplayedData.details = [translation('appealDetails.remandReturnDescription')]
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

const AppealCurrentStatus: FC<AppealCurrentStatusProps> = ({ status, aoj, appealType, docketName, programArea }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const marginTop = theme.dimensions.condensedMarginBetween
  const statusHeadingAndTitle = getStatusHeadingAndTitle(status, aoj, appealType, profile?.fullName || '', t, docketName || 'UNDF DOCKET')

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
              <VABulletList listOfText={[details[1], details[2]]} />
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
            color: 'link',
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
              <VABulletList listOfText={bulletList} />
            </Box>
          </Box>
        )
      case AppealStatusTypesConstants.merged:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <TextView mt={marginTop} onPress={(): Promise<void> => Linking.openURL(LINK_URL_YOUR_CLAIMS)}>
              <TextView variant="MobileBody">{details[1]}</TextView>
              <TextView variant="MobileBodyLink" color="link">
                {details[2]}
              </TextView>
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
            <TextView mt={marginTop} onPress={(): Promise<void> => Linking.openURL(LINK_URL_YOUR_CLAIMS)}>
              <TextView variant="MobileBody">{details[1]}</TextView>
              <TextView variant="MobileBodyLink" color="link">
                {details[2]}
              </TextView>
              <TextView variant="MobileBody">{details[3]}</TextView>
              <TextView variant="MobileBodyLink" color="link" onPress={(): Promise<void> => Linking.openURL(LINK_URL_DECISION_REVIEWS)}>
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
            <AppealDecision aoj={aoj} boardDecision={true} ama={appealType === AppealTypesConstants.appeal} issues={status.details?.issues || []} />
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
            <AppealDecision aoj={aoj} boardDecision={true} ama={appealType === AppealTypesConstants.appeal} issues={status.details?.issues || []} />
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
          console.log('IN HERE')
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
            <AppealDecision aoj={aoj} boardDecision={false} ama={appealType === AppealTypesConstants.appeal} issues={status.details?.issues || []} />
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
            <AppealDecision aoj={aoj} boardDecision={false} ama={appealType === AppealTypesConstants.appeal} issues={status.details?.issues || []} />
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
