import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { Box, TextArea, TextView } from 'components'
import { ClaimData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type ClaimIssuesProps = {
  claim: ClaimData
}

const ClaimIssues: FC<ClaimIssuesProps> = ({ claim }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { attributes } = claim

  const formattedDateFiled = formatDateMMMMDDYYYY(attributes?.dateFiled || '')

  const getContentionList = (): ReactElement[] => {
    return _.map(attributes.contentionList, (contention, index) => {
      return (
        <TextView variant="MobileBody" key={index}>
          {contention.trim()}
        </TextView>
      )
    })
  }

  return (
    <Box {...testIdProps('Claim-issues-screen')}>
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
            {getContentionList()}
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

export default ClaimIssues
