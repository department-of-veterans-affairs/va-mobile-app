import React from 'react'
import { context, render, screen } from 'testUtils'
import { CategoryLanding } from './CategoryLanding'

context('CategoryLandingTemplate', () => {
    beforeEach(() => {
        render(<CategoryLanding title='category' />)
    })

    it('should render the title as a header', () => {
        expect(screen.getByRole('header', { name: 'category' })).toBeTruthy()
    })
    it('should render Veterans Crisis Line information', () => {
        expect(screen.getByText(/Veterans Crisis Line/)).toBeTruthy()
    })
})
