import React, { FC, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

type RemoveDataProps = {
  pageName: string
  alertText: string
}

const RemoveData: FC<RemoveDataProps> = ({ pageName, alertText }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const [displayAlert, setDisplayAlert] = useState(false)

  if (!displayAlert) {
    return <VAButton onPress={() => setDisplayAlert(true)} label={t('personalInformation.removeData', { pageName })} buttonType={ButtonTypesConstants.buttonPrimary} />
  }

  return (
    <AlertBox
      border="confirmation"
      background="noCardBackground"
      title={t('personalInformation.areYouSureYouWantToDelete', { alertText })}
      text={t('personalInformation.deleteDataInfo', { alertText })}
      textA11yLabel={t('personalInformation.deleteDataInfoA11yLabel', { alertText })}>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton onPress={() => {}} label={t('personalInformation.confirm')} buttonType={ButtonTypesConstants.buttonPrimary} />
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <VAButton onPress={() => setDisplayAlert(false)} label={t('common:cancel')} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    </AlertBox>
  )
}

export default RemoveData
