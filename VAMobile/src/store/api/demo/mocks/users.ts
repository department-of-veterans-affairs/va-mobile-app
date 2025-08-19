export type DemoUserIds = 'kimberlyWashington' | 'benjaminAdams' | 'claraJefferson'
type DemoUsersT = Record<
  DemoUserIds,
  {
    name: string
    notes?: string
  }
>

const DemoUsers: DemoUsersT = {
  kimberlyWashington: {
    name: 'Kimberly Washington',
    notes: 'US Coast Guard. Default demo user.',
  },
  benjaminAdams: {
    name: 'Benjamin Adams',
    notes: 'US Army. No appointments, claims, prescriptions or messages.',
  },
  claraJefferson: {
    name: 'Clara Jefferson',
    notes: 'US Air Force. All authorized services disabled',
  },
}

export default DemoUsers
