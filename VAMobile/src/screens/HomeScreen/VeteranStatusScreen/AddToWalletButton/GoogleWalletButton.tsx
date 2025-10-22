import React from 'react'
import { Alert, Linking, Pressable } from 'react-native'

import { t } from 'i18next'

import { VeteranPassPayload } from 'api/wallet/createGooglePass'
import { useCreateGooglePass } from 'api/wallet/useCreateGooglePass'
import { Box, TextView } from 'components'
import AddToGoogleWalletButton from 'components/VAIcon/svgs/wallet/AddToGoogleWallet.svg'
import { useTheme } from 'utils/hooks'

type Props = {
  payload: VeteranPassPayload
}

export default function GoogleWalletButton({ payload }: Props) {
  const theme = useTheme()
  const createPass = useCreateGooglePass()

  const onPress = async () => {
    try {
      // Create new pass
      const response = await createPass.mutateAsync(payload)
      console.log('Created Google Pass response:', JSON.stringify(response, null, 2))
      const saveUrl = response.save_url

      if (!saveUrl) {
        throw new Error('No save URL returned from API')
      }

      console.log('Opening Google Wallet URL:', saveUrl)

      // Open the Google Wallet save URL
      console.log('Checking if URL can be opened:', saveUrl)
      const canOpen = await Linking.canOpenURL(saveUrl)
      console.log('Can open URL:', canOpen)

      if (canOpen) {
        console.log('Opening URL...')
        await Linking.openURL(saveUrl)
        console.log('✅ Successfully opened Google Wallet with save URL')
        // Note: If Google Wallet shows an error, it's likely a backend/configuration issue
        // on Google's side, not an issue with this app integration
      } else {
        console.error('Cannot open URL:', saveUrl)
        Alert.alert('Unable to open Google Wallet', 'Please ensure Google Wallet is installed on your device.')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('Google Wallet error details:', {
        message: e?.message,
        stack: e?.stack,
        error: e,
      })
      Alert.alert('Unable to add pass', `Error: ${e?.message ?? 'Something went wrong'}\n\nCheck console for details.`)
    }
  }

  return (
    <Box my={theme.dimensions.standardMarginBetween}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t('veteranStatus.wallet.google.addButton')}
        accessibilityHint={t('veteranStatus.wallet.google.addButton.hint')}>
        <AddToGoogleWalletButton width="100%" height={48} />
      </Pressable>
      <TextView variant="MobileBody" color="bodyText" mt={12}>
        Get quick access to your Veteran Status Card by adding it to your Google Wallet app.
      </TextView>
    </Box>
  )
}
