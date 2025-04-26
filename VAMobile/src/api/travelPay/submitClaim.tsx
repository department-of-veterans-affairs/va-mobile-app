export const submitClaim = (success: boolean = true, delay: number = 1000) => {
  console.log('submitClaim', { success, delay })
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve()
      } else {
        reject(new Error('Failed to submit travel claim'))
      }
    }, delay)
  })
}
