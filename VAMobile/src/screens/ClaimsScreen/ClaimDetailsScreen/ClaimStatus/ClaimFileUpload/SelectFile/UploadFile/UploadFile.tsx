import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { fileUploadSuccess, uploadFileToClaim } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type UploadFileProps = StackScreenProps<ClaimsStackParamList, 'UploadFile'>

const UploadFile: FC<UploadFileProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { claim, filesUploadedSuccess, error } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { request, fileUploaded, imageUploaded } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  useEffect(() => {
    if (filesUploadedSuccess && !error) {
      navigateTo('UploadSuccess')()
      dispatch(fileUploadSuccess())
    }
  }, [filesUploadedSuccess, error, navigateTo, dispatch])

  const onUpload = (): void => {
    const filesList = fileUploaded ? [fileUploaded] : [imageUploaded]
    dispatch(uploadFileToClaim(claim?.id || '', request, filesList))
  }

  return (
    <ScrollView {...testIdProps('File upload: upload file')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {request.displayName}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.titleHeaderAndElementMargin}>
          {fileUploaded?.name || imageUploaded?.fileName}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onUpload}
            label={t('fileUpload.upload')}
            testID={t('fileUpload.upload')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('fileUpload.uploadFileA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default UploadFile
