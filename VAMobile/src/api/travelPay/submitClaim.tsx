export const submitClaim = (success: boolean = true, delay: number = 1000) => {
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
