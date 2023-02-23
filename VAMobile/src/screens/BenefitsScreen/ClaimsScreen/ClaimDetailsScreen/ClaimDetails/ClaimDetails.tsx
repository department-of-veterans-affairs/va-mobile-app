import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextArea, TextView, VABulletList } from 'components'
import { ClaimData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type ClaimDetailsProps = {
  claim: ClaimData
}

/**
 * Content displayed in the details tab on the claim details screen
 *
 * @param claim - contains data to be displayed
 * @returns ClaimDetails component displaying claim data
 */
const ClaimDetails: FC<ClaimDetailsProps> = ({ claim }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { attributes } = claim

  const formattedDateFiled = formatDateMMMMDDYYYY(attributes?.dateFiled || '')

  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold">{t('claimDetails.claimType')}</TextView>
        <TextView variant="MobileBody">{attributes?.claimType || ''}</TextView>
        {attributes?.contentionList && attributes.contentionList.length > 0 && (
          <Box>
            <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
              {t('claimDetails.whatYouHaveClaimed')}
            </TextView>
            <VABulletList listOfText={attributes.contentionList} />
          </Box>
        )}
        <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('claimDetails.dateReceived')}
        </TextView>
        <TextView variant="MobileBody">{formattedDateFiled}</TextView>
        <TextView accessibilityLabel={t('claimDetails.yourRepresentative.a11yLabel')} variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('claimDetails.yourRepresentative')}
        </TextView>
        <TextView variant="MobileBody">{attributes?.vaRepresentative || t('claimDetails.yourRepresentative.notAvailable')}</TextView>
      </TextArea>
    </Box>
  )
}

export default ClaimDetails
