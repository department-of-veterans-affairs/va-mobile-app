import React, { FC } from 'react'
import { Button } from 'react-native'
import { useDispatch } from 'react-redux'

import { logout } from 'store/actions'

const SettingsScreen: FC = () => {
    const dispatch = useDispatch()

    const onLogout = (): void => {
        dispatch(logout())
    }

    return <Button title="Logout" onPress={onLogout} />
}

export default SettingsScreen
