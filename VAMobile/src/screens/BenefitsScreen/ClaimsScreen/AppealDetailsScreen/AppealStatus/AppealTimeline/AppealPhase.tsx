import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppealEventData, AppealEventTypes } from 'store/api/types'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeFirstLetter, formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import PhaseIndicator from '../../../ClaimDetailsScreen/ClaimStatus/ClaimTimeline/PhaseIndicator'

const snakeCaseToCamelCase = (snakeCase: string) => {
  return snakeCase
    .split('_')
    .map((word, i) => (i === 0 ? word : capitalizeFirstLetter(word)))
    .join('')
}

const getEventName = (type: AppealEventTypes, t: TFunction): string => {
  const translated = t(`appealDetails.${snakeCaseToCamelCase(type)}`)
  return translated.startsWith('appealDetails') ? t('appealDetails.unknown') : translated
}

type AppealPhaseProps = {
  event: AppealEventData
}

// TODO: Determine what should be displayed for the following types (currently "Unknown"):
//   AppealEventTypesConstants.ftr
//   AppealEventTypesConstants.record_designation
//   AppealEventTypesConstants.dro_hearing_held
//   AppealEventTypesConstants.dro_hearing_cancelled
//   AppealEventTypesConstants.dro_hearing_no_show

const AppealPhase: FC<AppealPhaseProps> = ({ event }) => {
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
          <Box {...testIdProps(`${heading} ${dateText}`)} flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
            <TextView variant={'MobileBodyBold'}>{heading}</TextView>
            <TextView variant={'MobileBody'}>{dateText}</TextView>
          </Box>
        </Box>
      </TextArea>
    </Box>
  )
}

export default AppealPhase
