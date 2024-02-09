import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'
import { camelCase } from 'lodash'

import { AppealEventData, AppealEventTypes } from 'api/types'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

import PhaseIndicator from '../../../ClaimDetailsScreen/ClaimStatus/ClaimTimeline/PhaseIndicator'

const getEventName = (type: AppealEventTypes, t: TFunction) => {
  const translated = t(`appealDetails.${camelCase(type)}`)
  return translated.startsWith('appealDetails') ? t('appealDetails.unknown') : translated
}

type AppealPhaseProps = {
  event: AppealEventData
}

function AppealPhase({ event }: AppealPhaseProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const formattedDate = formatDateMMMMDDYYYY(event.date)
  const heading = getEventName(event.type, t)
  const dateText = event.date ? t('appealDetails.onDate', { date: formattedDate }) : ''

  return (
    <Box borderBottomWidth={theme.dimensions.borderWidth} borderColor={'primary'}>
      <TextArea noBorder={true}>
        <Box flexDirection={'row'}>
          <PhaseIndicator phase={-1} current={0} />
          <Box
            accessibilityLabel={a11yLabelVA(`${heading} ${dateText}`)}
            flexDirection={'column'}
            justifyContent={'flex-start'}
            flex={1}>
            <TextView variant={'MobileBodyBold'}>{heading}</TextView>
            <TextView variant={'MobileBody'}>{dateText}</TextView>
          </Box>
        </Box>
      </TextArea>
    </Box>
  )
}

export default AppealPhase
