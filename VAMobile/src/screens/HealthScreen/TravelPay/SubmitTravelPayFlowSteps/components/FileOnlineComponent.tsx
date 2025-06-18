import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

import FileOnBTSSSLink from './FileOnBTSSSLink'

const { LINK_URL_VA_FORM_10_3542 } = getEnv()

type FileOnlineComponentProps = {
  onBeforeOpenTravelPayWebview?: () => void
}

function FileOnlineComponent({ onBeforeOpenTravelPayWebview }: FileOnlineComponentProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <View testID="fileOnlineComponent">
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView testID="fileOnlineTitle" variant="MobileBodyBold">
          {t('travelPay.otherWaysToFile')}
        </TextView>
        <TextView testID="fileOnlineComponentMethod1ID" variant="MobileBody">
          {t('travelPay.otherWaysToFile.method1')}
        </TextView>
        <Box my={theme.dimensions.condensedMarginBetween}>
          <FileOnBTSSSLink
            text={t('travelPay.otherWaysToFile.method1.link')}
            testID="fileOnlineBTSSSLink"
            onBeforeOpenWebview={onBeforeOpenTravelPayWebview}
          />
        </Box>
        <TextView testID="fileOnlineComponentMethod2ID" variant="MobileBody">
          {t('travelPay.otherWaysToFile.method2')}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_VA_FORM_10_3542}
            text={t('travelPay.otherWaysToFile.method2.link')}
            a11yLabel={a11yLabelVA(t('travelPay.otherWaysToFile.method2.link'))}
            testID="fileOnlineVAFormLink"
          />
        </Box>
      </Box>
    </View>
  )
}

export default FileOnlineComponent
