import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect } from 'react'

import { AlertBox, BackButton, Box, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsAndAppealsState, StoreState } from 'store/reducers'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type UploadSuccessProps = StackScreenProps<ClaimsStackParamList, 'UploadSuccess'>

const UploadSuccess: FC<UploadSuccessProps> = ({ navigation }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const { claim } = useSelector<StoreState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)

  const navigateToFileRequests = navigateTo('ClaimFileUpload', {
    claimID: claim?.id,
    currentPhase: claim?.attributes.phase,
  })

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
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
    <ScrollView {...testIdProps('File upload: upload success')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox title={t('fileUpload.yourFileWasUploaded')} text={t('fileUpload.thankYouForUploading')} border="success" background="noCardBackground">
          <Box mt={theme.dimensions.marginBetween}>
            <VAButton
              onPress={navigateToFileRequests}
              label={t('fileUpload.viewAllFileRequests')}
              testID={t('fileUpload.viewAllFileRequests')}
              textColor="primaryContrast"
              backgroundColor="button"
              a11yHint={t('fileUpload.viewAllFileRequestsA11yHint')}
            />
          </Box>
        </AlertBox>
      </Box>
    </ScrollView>
  )
}

export default UploadSuccess
