import React from 'react'

import { screen } from '@testing-library/react-native'

import { MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import OHAlertManager, { OHParentScreens } from 'components/OHAlertManager'
import { context, render } from 'testUtils'

context('OHAlertManager', () => {
  const mockFacilities = [
    {
      facilityId: 528,
      facilityName: 'Test VA Medical Center',
    },
    {
      facilityId: 123,
      facilityName: 'Different VA Medical Center',
    },
  ]

  const mockPhases = {
    current: 'p0',
    p0: 'March 1, 2026',
    p1: 'March 15, 2026',
    p2: 'April 1, 2026',
    p3: 'April 24, 2026',
    p4: 'April 27, 2026',
    p5: 'May 1, 2026',
    p6: 'May 3, 2026',
    p7: 'May 8, 2026',
  }

  const createMigration = (currentPhase: string): MigratingFacility => ({
    migrationDate: '2026-05-01',
    facilities: mockFacilities,
    phases: {
      ...mockPhases,
      current: currentPhase,
    },
  })

  const createAuthorizedServices = (currentPhase: string): UserAuthorizedServicesData =>
    ({
      migratingFacilitiesList: [createMigration(currentPhase)],
    }) as UserAuthorizedServicesData

  describe('Appointments screen', () => {
    it('should render warning alert for p0 phase', () => {
      const authorizedServices = createAuthorizedServices('p0')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 1, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render warning alert for p1 phase', () => {
      const authorizedServices = createAuthorizedServices('p1')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 1, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render error alert for p2 phase', () => {
      const authorizedServices = createAuthorizedServices('p2')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage appointments online for some facilities right now")).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render error alert for p3 phase', () => {
      const authorizedServices = createAuthorizedServices('p3')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage appointments online for some facilities right now")).toBeTruthy()
    })

    it('should render error alert for p4 phase', () => {
      const authorizedServices = createAuthorizedServices('p4')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage appointments online for some facilities right now")).toBeTruthy()
    })

    it('should render error alert for p5 phase', () => {
      const authorizedServices = createAuthorizedServices('p5')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage appointments online for some facilities right now")).toBeTruthy()
    })

    it('should render error alert for p6 phase', () => {
      const authorizedServices = createAuthorizedServices('p6')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage appointments online for some facilities right now")).toBeTruthy()
    })

    it('should not render alert for p7 phase', () => {
      const authorizedServices = createAuthorizedServices('p7')
      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.queryByText("You can't manage appointments online for some facilities right now")).toBeFalsy()
    })
  })

  describe('SecureMessaging screen', () => {
    it('should render warning alert for p1 phase', () => {
      const authorizedServices = createAuthorizedServices('p1')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 24, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render warning alert for p2 phase', () => {
      const authorizedServices = createAuthorizedServices('p2')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 24, 2026')).toBeTruthy()
    })

    it('should render error alert for p3 phase', () => {
      const authorizedServices = createAuthorizedServices('p3')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render error alert for p4 phase', () => {
      const authorizedServices = createAuthorizedServices('p4')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy()
    })

    it('should render error alert for p5 phase', () => {
      const authorizedServices = createAuthorizedServices('p5')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't use messages to contact some facilities right now")).toBeTruthy()
    })

    it('should not render alert for p6 phase', () => {
      const authorizedServices = createAuthorizedServices('p6')
      render(<OHAlertManager parentScreen={OHParentScreens.SecureMessaging} authorizedServices={authorizedServices} />)

      expect(screen.queryByText("You can't use messages to contact some facilities right now")).toBeFalsy()
    })
  })

  describe('MedicalRecords screen', () => {
    it('should render warning alert for p1 phase', () => {
      const authorizedServices = createAuthorizedServices('p1')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin May 1, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render warning alert for p2 phase', () => {
      const authorizedServices = createAuthorizedServices('p2')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin May 1, 2026')).toBeTruthy()
    })

    it('should render warning alert for p3 phase', () => {
      const authorizedServices = createAuthorizedServices('p3')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin May 1, 2026')).toBeTruthy()
    })

    it('should render warning alert for p4 phase', () => {
      const authorizedServices = createAuthorizedServices('p4')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin May 1, 2026')).toBeTruthy()
    })

    it('should render error alert for p5 phase', () => {
      const authorizedServices = createAuthorizedServices('p5')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.getByText('New medical records may not appear here until May 3, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should not render alert for p6 phase', () => {
      const authorizedServices = createAuthorizedServices('p6')
      render(<OHAlertManager parentScreen={OHParentScreens.MedicalRecords} authorizedServices={authorizedServices} />)

      expect(screen.queryByText('New medical records may not appear here until May 3, 2026')).toBeFalsy()
    })
  })

  describe('Medications screen', () => {
    it('should render warning alert for p1 phase', () => {
      const authorizedServices = createAuthorizedServices('p1')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 27, 2026')).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render warning alert for p2 phase', () => {
      const authorizedServices = createAuthorizedServices('p2')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 27, 2026')).toBeTruthy()
    })

    it('should render warning alert for p3 phase', () => {
      const authorizedServices = createAuthorizedServices('p3')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.getByText('App updates will begin April 27, 2026')).toBeTruthy()
    })

    it('should render error alert for p4 phase', () => {
      const authorizedServices = createAuthorizedServices('p4')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage medications online for some facilities right now")).toBeTruthy()
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render error alert for p5 phase', () => {
      const authorizedServices = createAuthorizedServices('p5')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.getByText("You can't manage medications online for some facilities right now")).toBeTruthy()
    })

    it('should not render alert for p6 phase', () => {
      const authorizedServices = createAuthorizedServices('p6')
      render(<OHAlertManager parentScreen={OHParentScreens.Medications} authorizedServices={authorizedServices} />)

      expect(screen.queryByText("You can't manage medications online for some facilities right now")).toBeFalsy()
    })
  })

  describe('Empty migrating facilities list', () => {
    it('should not render alerts when migratingFacilitiesList is empty', () => {
      const authorizedServices = {
        migratingFacilitiesList: [],
      } as unknown as UserAuthorizedServicesData

      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.queryByText('App updates will begin')).toBeFalsy()
      expect(screen.queryByText("You can't manage appointments online for some facilities right now")).toBeFalsy()
    })

    it('should not render alerts when migratingFacilitiesList is undefined', () => {
      const authorizedServices = {} as UserAuthorizedServicesData

      render(<OHAlertManager parentScreen={OHParentScreens.Appointments} authorizedServices={authorizedServices} />)

      expect(screen.queryByText('App updates will begin')).toBeFalsy()
      expect(screen.queryByText("You can't manage appointments online for some facilities right now")).toBeFalsy()
    })
  })
})
