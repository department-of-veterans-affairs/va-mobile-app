import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const ClaimFileUpload: FC = () => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  return (
    <ScrollView {...testIdProps('Claim-file-upload-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('fileUpload.uploadFileToClaim')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.toHelpUs')}</TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('fileUpload.maxFileSize')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.50MB')}</TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween}>
            {t('fileUpload.acceptedFileTypes')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ClaimFileUpload
