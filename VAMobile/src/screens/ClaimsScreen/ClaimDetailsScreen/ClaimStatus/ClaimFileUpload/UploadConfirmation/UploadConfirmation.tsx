import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ErrorComponent, TextView, VAButton } from 'components'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDs } from 'constants/screens'
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
      headerLeft: () => null,
    })
  })

  useEffect(() => {
    if (filesUploadedSuccess && !error) {
      navigation.navigate('UploadSuccess')
      dispatch(fileUploadSuccess())
    }
  }, [filesUploadedSuccess, error, navigation, dispatch])

  const onUpload = (): void => {
    dispatch(uploadFileToClaim(claim?.id || '', request, filesList, ScreenIDs.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID))
  }

  if (useError(ScreenIDs.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID)) {
    return <ErrorComponent />
  }

  return (
    <ScrollView {...testIdProps('File upload: upload confirmation')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.pleaseConfirmUpload', { requestTitle: request.displayName || t('fileUpload.request') })}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onUpload}
            label={t('fileUpload.confirmUpload')}
            testID={t('fileUpload.confirmUpload')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('fileUpload.confirmUploadA11yHint')}
          />
        </Box>
        <Box mt={theme.dimensions.marginBetweenCards}>
          <VAButton
            onPress={(): void => navigation.goBack()}
            label={t('common:cancel')}
            testID={t('common:cancel')}
            textColor="altButton"
            backgroundColor="textBox"
            borderColor="secondary"
            a11yHint={t('fileUpload.cancelUploadA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default UploadConfirmation
