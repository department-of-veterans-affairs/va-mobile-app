import { TFunction } from 'i18next'
import React, { FC } from 'react'

import { AppealEventData, AppealEventTypes, AppealEventTypesConstants } from 'store/api/types'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import PhaseIndicator from '../../../ClaimDetailsScreen/ClaimStatus/ClaimTimeline/PhaseIndicator'

const getEventName = (type: AppealEventTypes, translation: TFunction): string => {
  switch (type) {
    case AppealEventTypesConstants.claim_decision:
      return translation('appealDetails.claimDecision')
    case AppealEventTypesConstants.nod:
      return translation('appealDetails.nod')
    case AppealEventTypesConstants.soc:
      return translation('appealDetails.soc')
    case AppealEventTypesConstants.form9:
      return translation('appealDetails.form9')
    case AppealEventTypesConstants.ssoc:
      return translation('appealDetails.ssoc')
    case AppealEventTypesConstants.certified:
      return translation('appealDetails.certified')
    case AppealEventTypesConstants.hearing_held:
      return translation('appealDetails.hearingHeld')
    case AppealEventTypesConstants.hearing_no_show:
      return translation('appealDetails.hearingNoShow')
    case AppealEventTypesConstants.transcript:
      return translation('appealDetails.transcript')
    case AppealEventTypesConstants.bva_decision:
      return translation('appealDetails.bvaDecision')
    case AppealEventTypesConstants.cavc_decision:
      return translation('appealDetails.cavcDecision')
    case AppealEventTypesConstants.remand_return:
      return translation('appealDetails.remandReturn')
    case AppealEventTypesConstants.ramp_notice:
      return translation('appealDetails.rampNotice')
    case AppealEventTypesConstants.field_grant:
      return translation('appealDetails.fieldGrant')
    case AppealEventTypesConstants.withdrawn:
      return translation('appealDetails.withdrawn')
    case AppealEventTypesConstants.other_close:
      return translation('appealDetails.otherClose')
    case AppealEventTypesConstants.ramp:
      return translation('appealDetails.ramp')
    case AppealEventTypesConstants.death:
      return translation('appealDetails.death')
    case AppealEventTypesConstants.merged:
      return translation('appealDetails.merged')
    case AppealEventTypesConstants.reconsideration:
      return translation('appealDetails.reconsideration')
    case AppealEventTypesConstants.vacated:
      return translation('appealDetails.vacated')
    case AppealEventTypesConstants.sc_request:
      return translation('appealDetails.scRequest')
    case AppealEventTypesConstants.hlr_request:
      return translation('appealDetails.hlrRequest')
    case AppealEventTypesConstants.ama_nod:
      return translation('appealDetails.amaNod')
    case AppealEventTypesConstants.docket_change:
      return translation('appealDetails.docketChange')
    case AppealEventTypesConstants.distributed_to_vlj:
      return translation('appealDetails.distributedToVlj')
    case AppealEventTypesConstants.bva_decision_effectuation:
      return translation('appealDetails.bvaDecisionEffectuation')
    case AppealEventTypesConstants.dta_decision:
      return translation('appealDetails.dtaDecision')
    case AppealEventTypesConstants.sc_other_close:
      return translation('appealDetails.scOtherClose')
    case AppealEventTypesConstants.hlr_decision:
      return translation('appealDetails.hlrDecision')
    case AppealEventTypesConstants.hlr_dta_error:
      return translation('appealDetails.hlrDtaError')
    case AppealEventTypesConstants.hlr_other_close:
      return translation('appealDetails.hlrOtherClose')
    case AppealEventTypesConstants.statutory_opt_in:
      return translation('appealDetails.statutoryOptIn')

    // TODO: determine what is displayed for these cases
    case AppealEventTypesConstants.ftr:
      return translation('appealDetails.unknown')
    case AppealEventTypesConstants.record_designation:
      return translation('appealDetails.unknown')
    case AppealEventTypesConstants.dro_hearing_held:
      return translation('appealDetails.unknown')
    case AppealEventTypesConstants.dro_hearing_cancelled:
      return translation('appealDetails.unknown')
    case AppealEventTypesConstants.dro_hearing_no_show:
      return translation('appealDetails.unknown')
  }

  return ''
}

type AppealPhaseProps = {
  event: AppealEventData
}

const AppealPhase: FC<AppealPhaseProps> = ({ event }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  const formattedDate = formatDateMMMMDDYYYY(event.date)
  const heading = getEventName(event.type, t)
  const dateText = event.date ? t('appealDetails.onDate', { date: formattedDate }) : ''

  return (
    <Box borderBottomWidth={theme.dimensions.borderWidth} borderColor={'primary'}>
      <TextArea noBorder={true}>
        <Box flexDirection={'row'}>
          <PhaseIndicator phase={-1} current={0} />
          <Box {...testIdProps(`${heading} ${dateText}`)} flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
            <TextView variant={'MobileBodyBold'} color={'primaryTitle'}>
              {heading}
            </TextView>
            <TextView variant={'MobileBody'}>{dateText}</TextView>
          </Box>
        </Box>
      </TextArea>
    </Box>
  )
}

export default AppealPhase
