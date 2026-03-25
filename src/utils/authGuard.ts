import { toast } from 'react-toastify';
import type { NavigateFunction } from 'react-router-dom';

/**
 * Checks if user is authenticated. If not, shows a toast and redirects to login.
 * Returns `true` if authenticated, `false` otherwise.
 */
export function requireAuth(
  isLoggedIn: boolean,
  navigate: NavigateFunction,
  message = 'Please login to continue'
): boolean {
  if (!isLoggedIn) {
    toast.error(message);
    navigate('/login');
    return false;
  }
  return true;
}
