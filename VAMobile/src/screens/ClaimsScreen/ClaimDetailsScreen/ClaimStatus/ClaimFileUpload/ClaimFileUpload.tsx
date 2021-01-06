import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement } from 'react'

import _ from 'underscore'

import { AlertBox, Box, TextArea, TextView, VAButton } from 'components'
import { ClaimsStackParamList } from '../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ClaimFileUploadProps = StackScreenProps<ClaimsStackParamList, 'ClaimFileUpload'>

const ClaimFileUpload: FC<ClaimFileUploadProps> = ({ route }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const navigateTo = useRouteNavigation()
  const { requests, canRequestDecision } = route.params

  const numberOfRequests = requests.length

  const getUploadRequests = (): ReactElement[] => {
    return _.map(requests, (request, index) => {
      return (
        <Box mt={theme.dimensions.marginBetweenCards} key={index}>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {request.displayName}
            </TextView>
            <TextView variant="MobileBody" mb={theme.dimensions.marginBetween}>
              {request.description}
            </TextView>
            <VAButton
              onPress={(): void => {}}
              label={t('fileUpload.upload')}
              testID={t('fileUpload.upload')}
              textColor="primaryContrast"
              backgroundColor="button"
              a11yHint={t('fileUpload.uploadA11yHint')}
            />
          </TextArea>
        </Box>
      )
    })
  }

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
        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
          {t(`claimPhase.youHaveFileRequest${numberOfRequests > 1 ? 's' : ''}`, { numberOfRequests })}
        </TextView>
        {getUploadRequests()}
        {canRequestDecision && (
          <Box mt={theme.dimensions.marginBetween} mx={theme.dimensions.gutter}>
            <AlertBox title={t('fileUpload.askForYourClaimDecision')} text={t('fileUpload.youCanAskUs')} border="informational" background="noCardBackground">
              <Box mt={theme.dimensions.marginBetween}>
                <VAButton
                  onPress={navigateTo('AskForClaimDecision')}
                  label={t('fileUpload.viewDetails')}
                  testID={t('fileUpload.viewDetails')}
                  textColor="primaryContrast"
                  backgroundColor="button"
                  a11yHint={t('fileUpload.viewDetailsA11yHint')}
                />
              </Box>
            </AlertBox>
          </Box>
        )}
      </Box>
    </ScrollView>
  )
}

export default ClaimFileUpload
