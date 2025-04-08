import React from 'react'
import { useTranslation } from 'react-i18next'

import { LoadingComponent } from 'components'
import { NAMESPACE } from 'constants/namespaces'

function SubmitLoadingScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <LoadingComponent text={t('travelPay.submitLoading')} />
}

export default SubmitLoadingScreen
