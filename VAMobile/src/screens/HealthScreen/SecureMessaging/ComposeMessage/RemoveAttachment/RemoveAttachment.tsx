import React, { FC } from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, ButtonTypesConstants, VAButton, VAScrollView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type RemoveAttachmentProps = StackScreenProps<HealthStackParamList, 'RemoveAttachment'>

const RemoveAttachment: FC<RemoveAttachmentProps> = ({ route }) => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { attachmentFileToRemove } = route.params

  const onRemove = navigateTo('ComposeMessage', { attachmentFile: {}, attachmentFileToRemove })

  return (
    <VAScrollView {...testIdProps('Attachments: Remove-attachment-confirmation-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <VAButton onPress={onRemove} label={'Remove attachment'} buttonType={ButtonTypesConstants.buttonPrimary} />
      </Box>
    </VAScrollView>
  )
}

export default RemoveAttachment
