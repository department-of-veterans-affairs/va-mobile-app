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
    <Box {...testIdProps('Your-claim: Details-tab-claim-details-page')}>
      <TextArea>
        <Box {...testIdProps(t('claimDetails.claimType'))} accessibilityRole="header" accessible={true}>
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {t('claimDetails.claimType')}
          </TextView>
        </Box>
        <Box {...testIdProps(attributes?.claimType || '')} accessible={true}>
          <TextView variant="MobileBody">{attributes?.claimType || ''}</TextView>
        </Box>

        {attributes?.contentionList && attributes.contentionList.length > 0 && (
          <Box>
            <Box {...testIdProps(t('claimDetails.whatYouHaveClaimed'))} accessibilityRole="header" accessible={true}>
              <TextView variant="MobileBodyBold" color={'primaryTitle'} mt={theme.dimensions.standardMarginBetween}>
                {t('claimDetails.whatYouHaveClaimed')}
              </TextView>
            </Box>
            <VABulletList listOfText={attributes.contentionList} />
          </Box>
        )}

        <Box {...testIdProps(t('claimDetails.dateReceived'))} accessibilityRole="header" accessible={true}>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} mt={theme.dimensions.standardMarginBetween}>
            {t('claimDetails.dateReceived')}
          </TextView>
        </Box>
        <Box {...testIdProps(formattedDateFiled)} accessible={true}>
          <TextView variant="MobileBody">{formattedDateFiled}</TextView>
        </Box>

        <Box {...testIdProps(t('claimDetails.yourRepresentative.a11yLabel'))} accessibilityRole="header" accessible={true}>
          <TextView variant="MobileBodyBold" color={'primaryTitle'} mt={theme.dimensions.standardMarginBetween}>
            {t('claimDetails.yourRepresentative')}
          </TextView>
        </Box>
        <Box {...testIdProps(attributes?.vaRepresentative || '')} accessible={true}>
          <TextView variant="MobileBody">{attributes?.vaRepresentative || ''}</TextView>
        </Box>
      </TextArea>
    </Box>
  )
}

export default ClaimDetails
