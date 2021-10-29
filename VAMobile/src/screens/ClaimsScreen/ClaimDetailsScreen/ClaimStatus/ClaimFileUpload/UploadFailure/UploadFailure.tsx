import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, BackButton, Box, ButtonTypesConstants, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type UploadFailureProps = StackScreenProps<ClaimsStackParamList, 'UploadFailure'>

const UploadFailure: FC<UploadFailureProps> = ({ navigation }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const { claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const navigateToFileRequests = navigateTo('ClaimFileUpload', { claimID: claim?.id })

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={navigateToFileRequests}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.back}
          showCarat={true}
          a11yHint={t('fileUpload.uploadSuccessBackA11yHint')}
        />
      ),
    })
  })

  return (
    <VAScrollView {...testIdProps('File-Upload: Upload-success-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox title={t('fileUpload.yourFileNotUploaded')} text={t('fileUpload.sorry')} border="error" background="noCardBackground">
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={navigateToFileRequests}
              label={t('fileUpload.viewAllFileRequests')}
              testID={t('fileUpload.viewAllFileRequests')}
              buttonType={ButtonTypesConstants.buttonPrimary}
              a11yHint={t('fileUpload.viewAllFileRequestsA11yHint')}
            />
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default UploadFailure
