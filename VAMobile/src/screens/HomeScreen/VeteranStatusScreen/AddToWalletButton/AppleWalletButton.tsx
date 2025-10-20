import React, { useEffect, useState } from 'react'
import { Alert, View } from 'react-native'
import PassKit, { AddPassButton } from 'react-native-wallet-pass'

import { VeteranPassPayload } from 'api/wallet/createApplePkpassBase64'
import { useCreateApplePass } from 'api/wallet/useCreateApplePass'
import { TextView } from 'components'

type Props = {
  payload: VeteranPassPayload
}

export default function AppleWalletButton({ payload }: Props) {
  const [canAdd, setCanAdd] = useState<boolean>(true)
  const createPass = useCreateApplePass()

  useEffect(() => {
    // NOTE: Are we able to detect if pass is already in wallet? Might need native bridge.
    PassKit.canAddPasses()
      .then(setCanAdd)
      .catch(() => setCanAdd(false))
  }, [])

  const onPress = async () => {
    try {
      console.log('can add')
      if (!canAdd) {
        Alert.alert('Apple Wallet unavailable', 'Please enable Apple Wallet on this device.')
        return
      }
      const base64 = await createPass.mutateAsync(payload)
      console.log('base64: ' + base64)
      await PassKit.addPass(base64)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      Alert.alert('Unable to add pass', e?.message ?? 'Something went wrong')
    }
  }

  return (
    <View style={{ marginTop: 16 }}>
      {/* Need to handle UX for this button after we add the pass to the wallet. */}
      <AddPassButton onPress={onPress} style={{ height: 44 }} addPassButtonStyle={PassKit.AddPassButtonStyle.black} />
      <TextView variant="MobileBody" color="bodyText" mt={12}>
        Get quick access to your Veteran Status Card by adding it to your digital wallet app.
      </TextView>
    </View>
  )
}
