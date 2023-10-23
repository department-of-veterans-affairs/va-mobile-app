import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ClickToCallPhoneNumber, TextView, VAButton, VAScrollView } from 'components'
import { ErrorsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const IndividualMessageErrorComponent: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { tryAgain } = useSelector<RootState, ErrorsState>((state) => state.errors)

  const { standardMarginBetween } = theme.dimensions

  return (
    <VAScrollView>
      <Box justifyContent="center">
        <AlertBox
          title={t('secureMessaging.viewMessage.errorTitle')}
          titleA11yLabel={t('secureMessaging.viewMessage.errorTitle')}
          text={t('errors.callHelpCenter.sorryWithRefresh')}
          border="error">
          <Box>
            <TextView variant="MobileBody" my={standardMarginBetween} accessibilityLabel={t('secureMessaging.sendError.ifTheAppStill.a11y')}>
              {t('secureMessaging.sendError.ifTheAppStill')}
            </TextView>
            <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8773270022'))} phone={t('8773270022')} />
            {tryAgain && (
              <Box mt={standardMarginBetween} accessibilityRole="button">
                <VAButton onPress={tryAgain} label={t('refresh')} buttonType={ButtonTypesConstants.buttonPrimary} testID={t('refresh')} />
              </Box>
            )}
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default IndividualMessageErrorComponent
