import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { BackButton, Box, ButtonTypesConstants, TextView, VABulletList, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type AttachmentsProps = StackScreenProps<HealthStackParamList, 'Attachments'>

const Attachments: FC<AttachmentsProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onSelectAFile = (): void => {}

  return (
    <VAScrollView {...testIdProps('Attachments')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.attachments.fileAttachment')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.youMayAttach')}
        </TextView>
        <Box ml={theme.dimensions.gutter}>
          <VABulletList listOfText={[t('secureMessaging.attachments.acceptedFileTypes')]} />
        </Box>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.sizeRequirements')}
        </TextView>
        <VAButton
          label={t('secureMessaging.attachments.selectAFile')}
          onPress={onSelectAFile}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('secureMessaging.attachments.selectAFile.a11yHint')}
        />
      </Box>
    </VAScrollView>
  )
}

export default Attachments
