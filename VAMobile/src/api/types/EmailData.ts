export type EmailData = {
  id: string
  emailAddress: string
  updatedAt?: string
  confirmationDate?: string
}

export type SaveEmailData = {
  id?: string
  confirmationDate?: string
  emailAddress: string
}
