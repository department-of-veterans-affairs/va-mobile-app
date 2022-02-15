import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { StyleProp, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type FileRequestDetailsProps = StackScreenProps<ClaimsStackParamList, 'FileRequestDetails'>

const FileRequestDetails: FC<FileRequestDetailsProps> = ({ route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { request } = route.params
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { displayName, description, uploaded } = request

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    mt: contentMarginTop,
  }

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

  return (
    <VAScrollView {...testIdProps('file-request-details-page')} contentContainerStyle={mainViewStyle}>
      <Box mt={contentMarginTop} mb={contentMarginBottom} flex={1}>
        <TextArea>
          <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {displayName}
          </TextView>
          <TextView variant="MobileBody">{description}</TextView>
        </TextArea>
      </Box>
      {!uploaded && (
        <Box {...boxProps}>
          <Box mt={standardMarginBetween} mx={gutter} mb={contentMarginBottom}>
            <VAButton
              onPress={navigateTo('SelectFile', { request })}
              label={t('fileUpload.selectAFile')}
              testID={t('fileUpload.selectAFile')}
              buttonType={ButtonTypesConstants.buttonSecondary}
              a11yHint={t('fileUpload.selectAFileA11yHint')}
            />
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <VAButton
                onPress={navigateTo('TakePhotos', { request })}
                label={t('fileUpload.takePhotos')}
                testID={t('fileUpload.takePhotos')}
                buttonType={ButtonTypesConstants.buttonSecondary}
                a11yHint={t('fileUpload.takePhotosA11yHint')}
              />
            </Box>
          </Box>
        </Box>
      )}
    </VAScrollView>
  )
}

export default FileRequestDetails
