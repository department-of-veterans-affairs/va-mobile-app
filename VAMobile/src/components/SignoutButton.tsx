import { useDispatch } from 'react-redux'
import React, { FC, useState } from 'react'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'utils/hooks'
import ConfirmationAlert from './ConfirmationAlert'

const SignoutButton: FC = ({}) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)

  const [displayConfirm, setDisplayConfirm] = useState(false)

  useFocusEffect(
    React.useCallback(() => {
      setDisplayConfirm(false)
    }, []),
  )

  const onLogout = (): void => {
    dispatch(logout())
  }

  const onCancel = (): void => {
    setDisplayConfirm(false)
  }

  const onShowConfirm = (): void => {
    setDisplayConfirm(true)
  }

  if (displayConfirm) {
    return (
      <ConfirmationAlert
        title={t('logout.confirm.text')}
        background="noCardBackground"
        border="warning"
        confirmLabel={t('common:confirm')}
        confirmA11y={t('logout.confirm.a11yHint')}
        confirmOnPress={onLogout}
        cancelLabel={t('common:cancel')}
        cancelA11y={t('logout.cancel.a11yHint')}
        cancelOnPress={onCancel}
      />
    )
  } else {
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
}

export default SignoutButton
