import React, { FC, RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { AlertWithHaptics, Box, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type FormValidationAlertProps = {
  /** text to be displayed in description of the alert box */
  description: string
  /** Optional boolean for determining when to focus on error alert boxes. */
  focusOnError?: boolean
  /**sets if there is validation errors */
  hasValidationError?: boolean
  /**sets if attempted to save a draft */
  saveDraftAttempted?: boolean
  /** optional ref for parent scroll view */
  scrollViewRef?: RefObject<ScrollView>
  /** optional list of alertbox failed reasons*/
  errorList?: Array<string>
}

/**Common component to show a message alert when saving or sending a secure message */
const FormValidationAlert: FC<FormValidationAlertProps> = ({
  description,
  hasValidationError,
  scrollViewRef,
  focusOnError,
  errorList,
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return hasValidationError ? (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        variant="error"
        header={t('secureMessaging.formMessage.weNeedMoreInfo')}
        description={description}
        scrollViewRef={scrollViewRef}
        focusOnError={focusOnError}>
        <VABulletList listOfText={errorList || []} />
      </AlertWithHaptics>
    </Box>
  ) : (
    <></>
  )
}
export default FormValidationAlert
