import { TFunction } from 'i18next'
import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { AppealAOJTypes, AppealAOJTypesConstants, AppealStatusData, AppealStatusTypesConstants, AppealTypes, AppealTypesConstants } from 'store/api/types'
import { Box, TextArea, TextView, VABulletList, VABulletListText } from 'components'
import { Linking } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
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

const getStatusHeadingAndTitle = (status: AppealStatusData, aoj: AppealAOJTypes, appealType: AppealTypes, name: string, translation: TFunction): AppealStatusDisplayedData => {
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
  }

  return appealStatusDisplayedData
}

type AppealCurrentStatusProps = {
  status: AppealStatusData
  aoj: AppealAOJTypes
  appealType: AppealTypes
}

const AppealCurrentStatus: FC<AppealCurrentStatusProps> = ({ status, aoj, appealType }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const marginTop = theme.dimensions.condensedMarginBetween
  const statusHeadingAndTitle = getStatusHeadingAndTitle(status, aoj, appealType, profile?.fullName || '', t)

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
            <Box mr={theme.dimensions.gutter} mt={marginTop}>
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
            <Box mr={theme.dimensions.gutter} mt={marginTop}>
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
      case AppealStatusTypesConstants.remand:
      case AppealStatusTypesConstants.bva_decision:
        return (
          <Box>
            <TextView variant="MobileBody" mt={marginTop}>
              {details[0]}
            </TextView>
            <AppealDecision aoj={aoj} boardDecision={true} ama={appealType === AppealTypesConstants.appeal} issues={status.details?.issues || []} />
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
