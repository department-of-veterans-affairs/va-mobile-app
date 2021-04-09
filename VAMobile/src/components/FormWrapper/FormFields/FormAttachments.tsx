import React, { FC } from 'react'

import { Box, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'

const FormAttachments: FC = () => {
  const t = useTranslation(NAMESPACE.COMMON)

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <TextView>{t('attachments')}</TextView>
        <TextView color="link" textDecoration="underline">
          placeholder
        </TextView>
      </Box>
    </Box>
  )
}

export default FormAttachments
