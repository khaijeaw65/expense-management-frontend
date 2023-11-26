import { type User } from '~/types/user.model';

export const useUser = () => useState<User>('user', () => ({
  id: 0,
  username: '',
  password: '',
  firstName: '',
  lastName: '',
}))