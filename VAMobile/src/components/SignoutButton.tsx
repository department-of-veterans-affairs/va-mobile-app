import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/slices/authSlice'
import { testIdProps } from 'utils/accessibility'
import { useDestructiveAlert } from 'utils/hooks'
import { useDispatch } from 'react-redux'

/**Common component for the sign out button */
const SignoutButton: FC = ({}) => {
  const { t } = useTranslation(NAMESPACE.SETTINGS)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  const signOutAlert = useDestructiveAlert()
  const _logout = () => {
    dispatch(logout())
  }

  const onShowConfirm = (): void => {
    signOutAlert({
      title: t('logout.confirm.text'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: tc('cancel'),
        },
        {
          text: t('logout.title'),
          onPress: _logout,
        },
      ],
    })
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
