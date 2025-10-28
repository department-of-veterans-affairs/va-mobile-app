import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, DefaultList, DefaultListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

function NoticeOfRightsButton() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const noticeOfRightsButton: DefaultListItemObj = {
    textLines: [
      {
        text: t('debts.noticeOfRights.title'),
        variant: 'MobileBodyBold',
        mt: theme.dimensions.condensedMarginBetween,
        mb: theme.dimensions.condensedMarginBetween,
      },
    ],
    onPress: () => {
      navigateTo('NoticeOfRights')
    },
  }
  return (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <DefaultList items={[noticeOfRightsButton]} />
    </Box>
  )
}

export default NoticeOfRightsButton
