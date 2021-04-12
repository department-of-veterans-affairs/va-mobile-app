import { Pressable, ViewStyle } from 'react-native'
import React, { FC, useState } from 'react'
import LargeNavButton from "./LargeNavButton";
import {NAMESPACE} from "../constants/namespaces";
import {useTheme, useTranslation} from "../utils/hooks";

type UnreadButtonProps = {
    unread: number
}

const MessagesUnreadButton: FC<UnreadButtonProps> = ({}) => {
    const t = useTranslation(NAMESPACE.HEALTH)
    const theme = useTheme()
    return(
        <LargeNavButton
            title={t('appointments.title')}
            subText={t('appointments.subText')}
            a11yHint={t('appointments.a11yHint')}
            onPress={onAppointments}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}

        />
    )
}