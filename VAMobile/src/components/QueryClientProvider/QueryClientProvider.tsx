import React, { useEffect, useState } from 'react'
import { UserCredentials } from 'react-native-keychain'
import * as Keychain from 'react-native-keychain'
import { useSelector } from 'react-redux'

import NetInfo from '@react-native-community/netinfo'

import { ANDROID_DATABASE_PATH, IOS_LIBRARY_PATH, Storage } from '@op-engineering/op-sqlite'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query'
import { onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider, Persister } from '@tanstack/react-query-persist-client'

import queryClient from 'api/queryClient'
import { RootState } from 'store'
import { SettingsState, isBiometricsPreferred } from 'store/slices'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

export let storage: Storage

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const encryptionKeyGenerated = useSelector<RootState, boolean>((state) => state.auth.encryptionKeyGenerated)
  const [usesBiometrics, setUsesBiometrics] = useState(false)
  const [persister, setPersister] = useState<Persister>()
  const [readyForOffline, setReadyForOffline] = useState<boolean>()
  const offlineModeFeatureEnabled = featureEnabled('offlineMode')
  const { remoteConfigActivated } = useSelector<RootState, SettingsState>((state) => state.settings)

  useEffect(() => {
    setReadyForOffline(remoteConfigActivated && offlineModeFeatureEnabled && usesBiometrics)
  }, [remoteConfigActivated, offlineModeFeatureEnabled, usesBiometrics])

  // Checks async storage for biometrics preference
  useEffect(() => {
    const setBiometricsStatus = async () => {
      const biometricsPreferred = await isBiometricsPreferred()
      setUsesBiometrics(biometricsPreferred)
    }
    setBiometricsStatus()
  }, [encryptionKeyGenerated])

  // Creates persister when using persistent query client provider
  useEffect(() => {
    const getPersister = async () => {
      // Get the encryption key from the keychain
      const key = await Keychain.getGenericPassword()

      // Create op-sqlite storage with encryption enabled
      storage = new Storage({
        location: isIOS() ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH,
        encryptionKey: (key as UserCredentials).password,
      })

      const newPersister = createAsyncStoragePersister({
        storage,
      })

      setPersister(newPersister)
    }

    if (readyForOffline && usesBiometrics) {
      getPersister()

      // Using rnc net info create event listener for network connection status
      onlineManager.setEventListener((setOnline) => {
        return NetInfo.addEventListener((state) => {
          console.log('---- in NetInfo.addEventListener to set state - feature flag is')
          console.log(featureEnabled('offlineMode'))
          if (featureEnabled('offlineMode')) {
            setOnline(!!state.isConnected)
          }
        })
      })
    }
  }, [usesBiometrics, readyForOffline])

  // Only use persistent storage if biometrics are enabled and if the persister is available
  if (readyForOffline && persister) {
    console.log('Initializing persistent query')
    return (
      <PersistQueryClientProvider persistOptions={{ persister }} client={queryClient}>
        {children}
      </PersistQueryClientProvider>
    )
  }

  return <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
}

export default QueryClientProvider
