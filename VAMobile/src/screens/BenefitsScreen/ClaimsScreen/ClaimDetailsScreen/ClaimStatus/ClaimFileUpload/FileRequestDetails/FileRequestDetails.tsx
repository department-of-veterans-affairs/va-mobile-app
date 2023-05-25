import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, BoxProps, ButtonTypesConstants, ChildTemplate, TextArea, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { hasUploadedOrReceived } from 'utils/claims'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks'

type FileRequestDetailsProps = StackScreenProps<BenefitsStackParamList, 'FileRequestDetails'>

const FileRequestDetails: FC<FileRequestDetailsProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { request } = route.params
  const { displayName, description, uploadDate, documents } = request

  const hasUploaded = hasUploadedOrReceived(request)
  const noneNoted = t('noneNoted')

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    mt: theme.dimensions.contentMarginTop,
  }

  const getUploadedFileNames = (): JSX.Element[] | JSX.Element => {
    const uploadedFileNames = map(documents || [], (item, index) => {
      return (
        <TextView variant="MobileBody" key={index}>
          {item.filename}
        </TextView>
      )
    })

    return uploadedFileNames.length > 0 ? uploadedFileNames : <TextView variant="MobileBody">{noneNoted}</TextView>
  }

  // apparently we can use date here and not just uploadDate as well
  const getUploadedDate = (): string => {
    return uploadDate ? formatDateMMMMDDYYYY(uploadDate) : noneNoted
  }

  const getUploadedFileType = (): string | undefined => {
    return documents && documents.length > 0 ? documents[0].fileType : noneNoted
  }

  return (
    <ChildTemplate backLabel={t('request.backLabel')} backLabelOnPress={navigation.goBack} title={displayName || ''}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} flex={1}>
        {hasUploaded && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextArea>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.submittedTitle')}
              </TextView>
              <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBody">
                {getUploadedDate()}
              </TextView>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.fileTitle')}
              </TextView>
              <Box mb={theme.dimensions.standardMarginBetween}>{getUploadedFileNames()}</Box>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.typeTitle')}
              </TextView>
              <TextView variant="MobileBody">{getUploadedFileType()}</TextView>
            </TextArea>
          </Box>
        )}
        <TextArea>
          <TextView mb={theme.dimensions.standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {displayName}
          </TextView>
          <TextView variant="MobileBody">{description}</TextView>
        </TextArea>
      </Box>
      {!hasUploaded && (
        <Box {...boxProps}>
          <Box mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
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
    </ChildTemplate>
  )
}

export default FileRequestDetails
