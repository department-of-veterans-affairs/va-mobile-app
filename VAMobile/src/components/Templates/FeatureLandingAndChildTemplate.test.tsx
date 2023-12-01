import React from 'react'
import { context, render, screen, fireEvent } from 'testUtils'
import { FeatureLandingTemplate } from './FeatureLandingAndChildTemplate'
import TextView from 'components/TextView'

context('FeatureLandingAndChildTemplate', () => {
    const onPressSpy = jest.fn()
    const onBackPressSpy = jest.fn()

    const initializeTestInstance = (
        headerButton?: any,
        footerContent?: React.ReactNode
    ) => {
        render(<FeatureLandingTemplate backLabel='Back' backLabelOnPress={onBackPressSpy} title='Title' headerButton={headerButton} footerContent={footerContent} />)
    }

    beforeEach(() => {
        initializeTestInstance()
    })

    it('should render the title as a header when passed in', () => {
        initializeTestInstance()
        expect(screen.getByRole('header', { name: 'Title' })).toBeTruthy()
    })

    it('should render a back label and onPress', () => {
        initializeTestInstance()
        expect(screen.getByRole('button', { name: 'Back' })).toBeTruthy()
        fireEvent.press(screen.getByRole('button', { name: 'Back' }))
        expect(onBackPressSpy).toHaveBeenCalled()
    })

    it('should render a header button and onPress if passed in', () => {
        const headerButton = { label: 'test', icon: { name: 'HomeSelected' }, onPress: onPressSpy }
        initializeTestInstance(headerButton)
        fireEvent.press(screen.getByRole('button', { name: 'test' }))
        expect(onPressSpy).toHaveBeenCalled()
    })

    it('should render footer content if passed in', () => {
        const footer = <TextView>I am a footer</TextView>
        initializeTestInstance(undefined, footer)
        expect(screen.getByText('I am a footer')).toBeTruthy()
    })
})
