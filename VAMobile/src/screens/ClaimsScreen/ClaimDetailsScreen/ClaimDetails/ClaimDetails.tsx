import React, { FC } from 'react'

import { Box, TextArea, TextView, VABulletList } from 'components'
import { ClaimData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

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
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { attributes } = claim

  const formattedDateFiled = formatDateMMMMDDYYYY(attributes?.dateFiled || '')

  return (
    <Box {...testIdProps('Claim-details-info-screen')}>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.claimType')}
        </TextView>
        <TextView variant="MobileBody">{attributes?.claimType || ''}</TextView>

        {attributes?.contentionList && attributes.contentionList.length > 0 && (
          <Box>
            <TextView variant="MobileBodyBold" mt={theme.dimensions.marginBetween} accessibilityRole="header">
              {t('claimDetails.whatYouHaveClaimed')}
            </TextView>
            <VABulletList listOfText={attributes.contentionList} />
          </Box>
        )}

        <TextView variant="MobileBodyBold" mt={theme.dimensions.marginBetween} accessibilityRole="header">
          {t('claimDetails.dateReceived')}
        </TextView>
        <TextView variant="MobileBody">{formattedDateFiled}</TextView>

        <TextView variant="MobileBodyBold" mt={theme.dimensions.marginBetween} accessibilityRole="header">
          {t('claimDetails.yourRepresentative')}
        </TextView>
        <TextView variant="MobileBody">{attributes?.vaRepresentative || ''}</TextView>
      </TextArea>
    </Box>
  )
}

export default ClaimDetails
