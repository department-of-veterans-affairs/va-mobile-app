import { useDispatch } from 'react-redux'
import React, { FC, useState } from 'react'
import { Alert, ActionSheetIOS } from 'react-native'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDestructiveAlert, useTranslation } from 'utils/hooks'

const SignoutButton: FC = ({}) => {
  const t = useTranslation(NAMESPACE.SETTINGS)

  const onShowConfirm = (): void => {
    useDestructiveAlert(t('logout.confirm.text'), "")
  }

  return (
    <VAButton
      onPress={onShowConfirm}
      label={t('logout.title')}
      buttonType={ButtonTypesConstants.buttonImportant}
      a11yHint={t('logout.a11yHint')}
      {...testIdProps(t('logout.title'))}
    />
    )
}

export default SignoutButton
