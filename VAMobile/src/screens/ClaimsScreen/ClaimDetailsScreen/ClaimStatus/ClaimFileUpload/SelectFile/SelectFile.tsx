import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type SelectFilesProps = StackScreenProps<ClaimsStackParamList, 'SelectFile'>

const SelectFile: FC<SelectFilesProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { request } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  return (
    <ScrollView {...testIdProps('File upload: Select a file to upload for the request')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.selectAFileToUpload', { requestTitle: request.displayName || t('fileUpload.theRequest') })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
          {t('fileUpload.pleaseRequestFromPhoneFiles')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={(): void => {}}
            label={t('fileUpload.selectAFile')}
            testID={t('fileUpload.selectAFile')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('fileUpload.selectAFileWithPhoneA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SelectFile
