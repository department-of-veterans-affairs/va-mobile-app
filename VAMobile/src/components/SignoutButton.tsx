import React, { FC } from 'react'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDestructiveAlert, useTranslation } from 'utils/hooks'
import { useDispatch } from 'react-redux'

const SignoutButton: FC = ({}) => {
  const t = useTranslation(NAMESPACE.SETTINGS)
  const dispatch = useDispatch()
  const signOutAlert = useDestructiveAlert()
  const _logout = () => {
    dispatch(logout())
  }

  const onShowConfirm = (): void => {
    signOutAlert(t('logout.confirm.text'), '', t('logout.title'), _logout, t)
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
