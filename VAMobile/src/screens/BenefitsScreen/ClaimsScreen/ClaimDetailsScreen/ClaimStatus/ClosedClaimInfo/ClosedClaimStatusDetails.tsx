import React from 'react'
import { useTranslation } from 'react-i18next'

import { ClaimData } from 'api/types'
import { TextArea, TextView, VABulletList } from 'components'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'

type ClosedClaimStatusDetailsProps = {
  /** detailed claim information */
  claim: ClaimData
  /** indicates either open or closed claim */
  claimType: ClaimType
  /** true if decision letter can be downloaded */
  letterIsDownloadable: boolean
}

/**
 * Component to render status details for a closed claim
 */
function ClosedClaimStatusDetails({ claim, claimType, letterIsDownloadable }: ClosedClaimStatusDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { contentionList, eventsTimeline } = claim?.attributes
  const isClosed = claimType === ClaimTypeConstants.CLOSED
  const completedEvent = eventsTimeline?.find((element) => element.type === 'completed')

  if (!isClosed || !completedEvent?.date) {
    return <></>
  }

  const completedDate = formatDateMMMMDDYYYY(completedEvent.date)
  const letterText = letterIsDownloadable
    ? t('claimDetails.weDecidedDownload', { date: completedDate })
    : t('claimDetails.weDecidedMailed', { date: completedDate })

  return (
    <TextArea>
      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('claimDetails.step8of8')}
      </TextView>
      <TextView paragraphSpacing={true}>{letterText}</TextView>

      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('claimDetails.whatYouHaveClaimed')}
      </TextView>
      {contentionList?.length ? (
        <VABulletList listOfText={contentionList} paragraphSpacing={true} />
      ) : (
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('noneNoted')}
        </TextView>
      )}

      <TextView variant="MobileBodyBold" accessibilityRole="header">
        {t('payments')}
      </TextView>
      <TextView>{t('claimDetails.ifyoureentitled')}</TextView>
    </TextArea>
  )
}

export default ClosedClaimStatusDetails
