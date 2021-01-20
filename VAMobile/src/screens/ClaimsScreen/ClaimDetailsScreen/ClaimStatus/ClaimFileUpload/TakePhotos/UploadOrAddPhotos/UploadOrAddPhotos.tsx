import { Dimensions, ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'

import { AlertBox, BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { onAddPhotos } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme, useTranslation } from 'utils/hooks'

type UploadedImageProps = {
  /** width of image */
  width: number
}

const StyledImage = styled.Image`
  width: ${themeFn<UploadedImageProps>((theme, props) => props.width)}px;
  height: 150px;
`

type UploadOrAddPhotosProps = StackScreenProps<ClaimsStackParamList, 'UploadOrAddPhotos'>

const UploadOrAddPhotos: FC<UploadOrAddPhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request, firstImageResponse } = route.params
  const [imagesList, setImagesList] = useState([firstImageResponse])
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const displayImages = (): ReactElement[] => {
    const { gutter, marginBetweenCards } = theme.dimensions
    const windowWidth = Dimensions.get('window').width
    // calculate width to show 3 images per row
    const width = (windowWidth - gutter * 2 - marginBetweenCards * 3) / 3

    return _.map(imagesList, (image, index) => {
      return (
        <Box mt={marginBetweenCards} mr={marginBetweenCards} key={index} accessible={true} accessibilityRole="image">
          <StyledImage source={{ uri: image.uri }} width={width} />
        </Box>
      )
    })
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    setImagesList([...imagesList, response])
  }

  return (
    <ScrollView {...testIdProps('File upload: upload and add photos')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {request.displayName}
        </TextView>
        <Box mt={theme.dimensions.marginBetweenCards} display="flex" flexDirection="row" flexWrap="wrap">
          {displayImages()}
        </Box>
        {!!error && (
          <Box mt={theme.dimensions.marginBetween}>
            <AlertBox title={error} border="error" background="noCardBackground" />
          </Box>
        )}
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={(): void => {}}
            label={t('fileUpload.upload')}
            testID={t('fileUpload.upload')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('fileUpload.uploadA11yHint')}
          />
          {imagesList.length < 10 && (
            <Box mt={theme.dimensions.marginBetweenCards}>
              <VAButton
                onPress={(): void => onAddPhotos(t, showActionSheetWithOptions, setError, callbackIfUri)}
                label={t('fileUpload.addAnotherPhoto')}
                testID={t('fileUpload.addAnotherPhoto')}
                textColor="altButton"
                backgroundColor="textBox"
                borderColor="secondary"
                a11yHint={t('fileUpload.addAnotherPhotoA11yHint')}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default UploadOrAddPhotos
