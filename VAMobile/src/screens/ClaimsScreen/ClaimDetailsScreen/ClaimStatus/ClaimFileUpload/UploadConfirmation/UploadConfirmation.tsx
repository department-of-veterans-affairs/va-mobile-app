import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { BackButton, Box, ButtonTypesConstants, ErrorComponent, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { fileUploadSuccess, uploadFileToClaim } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type UploadConfirmationProps = StackScreenProps<ClaimsStackParamList, 'UploadConfirmation'>

const UploadConfirmation: FC<UploadConfirmationProps> = ({ route, navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { claim, filesUploadedSuccess, error } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { request, filesList } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={navigation.goBack} canGoBack={true} label={BackButtonLabelConstants.cancel} />,
    })
  })

  useEffect(() => {
    if (filesUploadedSuccess && !error) {
      navigation.navigate('UploadSuccess')
      dispatch(fileUploadSuccess())
    }
  }, [filesUploadedSuccess, error, navigation, dispatch])

  const onUpload = (): void => {
    dispatch(uploadFileToClaim(claim?.id || '', request, filesList, ScreenIDTypesConstants.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID))
  }

  if (useError(ScreenIDTypesConstants.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID} />
  }

  return (
    <VAScrollView {...testIdProps('File-upload: Upload-confirmation-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.pleaseConfirmUpload', { requestTitle: request.displayName || t('fileUpload.request') })}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onUpload}
            label={t('fileUpload.confirmUpload')}
            testID={t('fileUpload.confirmUpload')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('fileUpload.confirmUploadA11yHint')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <VAButton
            onPress={(): void => navigation.goBack()}
            label={t('common:cancel')}
            testID={t('common:cancel')}
            buttonType={ButtonTypesConstants.buttonSecondary}
            a11yHint={t('fileUpload.cancelUploadA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default UploadConfirmation
