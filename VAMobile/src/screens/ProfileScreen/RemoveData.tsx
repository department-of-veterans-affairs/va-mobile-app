import React, { FC, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type RemoveDataProps = {
  /** text to show in the initial button that displays the alert  */
  pageName: string
  /** text to show on the alert box */
  alertText: string
  /** Called when the confirm button is pressed */
  confirmFn: () => void
}

const RemoveData: FC<RemoveDataProps> = ({ pageName, alertText, confirmFn }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const [displayAlert, setDisplayAlert] = useState(false)

  if (!displayAlert) {
    return (
      <VAButton
        onPress={() => setDisplayAlert(true)}
        label={t('personalInformation.removeData', { pageName: stringToTitleCase(pageName) })}
        buttonType={ButtonTypesConstants.buttonImportant}
        a11yHint={t('personalInformation.removeData.a11yHint', { pageName })}
      />
    )
  }

  return (
    <AlertBox
      border="confirmation"
      title={t('personalInformation.areYouSureYouWantToDelete', { alertText })}
      text={t('personalInformation.deleteDataInfo', { alertText })}
      textA11yLabel={t('personalInformation.deleteDataInfoA11yLabel', { alertText })}>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton
          onPress={confirmFn || (() => {})}
          label={t('personalInformation.confirm')}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('personalInformation.confirm.a11yHint', { pageName })}
        />
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <VAButton
            onPress={() => setDisplayAlert(false)}
            label={t('common:cancel')}
            buttonType={ButtonTypesConstants.buttonSecondary}
            a11yHint={t('common:cancel.continueEditing.a11yHint')}
          />
        </Box>
      </Box>
    </AlertBox>
  )
}

export default RemoveData
