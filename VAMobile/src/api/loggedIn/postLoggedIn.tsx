import { post } from 'store/api'

/**
 * Post user logged in
 */
export const postLoggedIn = async () => {
  await post('v0/user/logged-in')
}
