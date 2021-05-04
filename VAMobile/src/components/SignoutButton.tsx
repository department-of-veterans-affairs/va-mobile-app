import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { ButtonTypesConstants } from './VAButton'
import { NAMESPACE } from 'constants/namespaces'
import { VAButton } from './index'
import { logout } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

const SignoutButton: FC = ({}) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)

  const onLogout = (): void => {
    dispatch(logout())
  }

  return (
    <VAButton onPress={onLogout} label={t('logout.title')} buttonType={ButtonTypesConstants.buttonImportant} a11yHint={t('logout.a11yHint')} {...testIdProps(t('logout.title'))} />
  )
}

export default SignoutButton
