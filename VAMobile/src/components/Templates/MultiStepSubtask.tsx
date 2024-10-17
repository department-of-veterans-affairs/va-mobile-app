import React, { createContext, useCallback, useContext, useState } from 'react'

import { ParamListBase, useFocusEffect } from '@react-navigation/native'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { Box, FullScreenSubtask, FullScreenSubtaskProps } from 'components'

const subtaskScreenOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
}

type SubtaskContextValue = {
  setSubtaskProps: React.Dispatch<React.SetStateAction<FullScreenSubtaskProps>>
}

export const SubtaskContext = createContext<SubtaskContextValue>({} as SubtaskContextValue)

/**
 * Hook for nested screens to set props on the parent FullScreenSubtask template
 * @param props - Props to set on FullScreenSubtask
 */
export const useSubtaskProps = (props: FullScreenSubtaskProps) => {
  const { setSubtaskProps } = useContext(SubtaskContext)

  useFocusEffect(
    useCallback(() => {
      setSubtaskProps(props)
    }, []), // eslint-disable-line react-hooks/exhaustive-deps
  )
}

type MultiStepSubtaskProps<T extends ParamListBase> = FullScreenSubtaskProps & {
  /** Child routes to render in the StackNavigator */
  children: React.ReactNode
  /** Stack navigator to wrap child routes */
  stackNavigator: ReturnType<typeof createStackNavigator<T>>
}

function MultiStepSubtask<T extends ParamListBase>({ ...props }: MultiStepSubtaskProps<T>) {
  const { children, stackNavigator } = props
  const [subtaskProps, setSubtaskProps] = useState<FullScreenSubtaskProps>({})

  return (
    <FullScreenSubtask {...subtaskProps}>
      <Box flex={1} backgroundColor="main">
        <SubtaskContext.Provider value={{ setSubtaskProps }}>
          <stackNavigator.Navigator screenOptions={subtaskScreenOptions}>{children}</stackNavigator.Navigator>
        </SubtaskContext.Provider>
      </Box>
    </FullScreenSubtask>
  )
}

export default MultiStepSubtask
