import React, { FC, ReactElement } from 'react'

import { AppealAOJTypes, AppealEventData, AppealStatusData, AppealTypes } from 'store/api/types'
import { Box, CollapsibleView, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'
import AppealCurrentStatus from './AppealCurrentStatus/AppealCurrentStatus'
import AppealTimeline from './AppealTimeline/AppealTimeline'
import NeedHelpData from 'screens/ClaimsScreen/NeedHelpData/NeedHelpData'

type AppealStatusProps = {
  events: Array<AppealEventData>
  status: AppealStatusData
  aoj: AppealAOJTypes
  appealType: AppealTypes
  numAppealsAhead: number | undefined
}

const AppealStatus: FC<AppealStatusProps> = ({ events, status, aoj, appealType, numAppealsAhead }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const NumAppealsAhead = (): ReactElement => {
    if (!numAppealsAhead) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.marginBetweenCards}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('appealDetails.appealsAheadOfYou')}
          </TextView>
          <TextView variant="MobileBody">{numAppealsAhead.toLocaleString()}</TextView>
        </TextArea>
      </Box>
    )
  }

  return (
    <Box>
      <CollapsibleView text={t('appealDetails.viewPastEvents')} inTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
        <AppealTimeline events={events} />
      </CollapsibleView>
      <Box mt={theme.dimensions.marginBetweenCards}>
        <AppealCurrentStatus status={status} aoj={aoj} appealType={appealType} />
      </Box>
      <NumAppealsAhead />
      <Box mt={theme.dimensions.marginBetweenCards}>
        <NeedHelpData isAppeal={true} />
      </Box>
    </Box>
  )
}

export default AppealStatus
