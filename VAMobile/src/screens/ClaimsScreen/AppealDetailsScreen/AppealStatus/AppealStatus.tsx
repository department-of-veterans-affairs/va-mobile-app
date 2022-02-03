import React, { FC, ReactElement } from 'react'

import { AppealAOJTypes, AppealEventData, AppealStatusData, AppealTypes } from 'store/api/types'
import { Box, CollapsibleView, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
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
  isActiveAppeal: boolean
  docketName: string | undefined
  programArea: string
}

const AppealStatus: FC<AppealStatusProps> = ({ events, status, aoj, appealType, numAppealsAhead, isActiveAppeal, docketName, programArea }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const NumAppealsAhead = (): ReactElement => {
    // if the number of appeals ahead does not exist or the appeal is closed
    if ((!numAppealsAhead && numAppealsAhead !== 0) || !isActiveAppeal) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
            {t('appealDetails.appealsAheadOfYou')}
          </TextView>
          <TextView variant="MobileBody">{numAppealsAhead.toLocaleString()}</TextView>
        </TextArea>
      </Box>
    )
  }

  return (
    <Box {...testIdProps('Your-appeal: Status-tab-appeal-details-page')}>
      <CollapsibleView text={t('appealDetails.viewPastEvents')} contentInTextArea={false} a11yHint={t('appealDetails.viewPastEventsA11yHint')}>
        <AppealTimeline events={events} />
      </CollapsibleView>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <AppealCurrentStatus status={status} aoj={aoj} appealType={appealType} docketName={docketName} programArea={programArea} />
      </Box>
      <NumAppealsAhead />
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <NeedHelpData isAppeal={true} />
      </Box>
    </Box>
  )
}

export default AppealStatus
