import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/slices/authSlice'
import { testIdProps } from 'utils/accessibility'
import { useDestructiveActionSheet } from 'utils/hooks'
import { useDispatch } from 'react-redux'

/**Common component for the sign out button */
const SignoutButton: FC = ({}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  const signOutAlert = useDestructiveActionSheet()
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
          text: t('cancel'),
        },
        {
          text: t('logout.title'),
          onPress: _logout,
        },
      ],
    })
  }

  return <VAButton onPress={onShowConfirm} label={t('logout.title')} buttonType={ButtonTypesConstants.buttonDestructive} {...testIdProps(t('logout.title'))} />
}

export default SignoutButton
