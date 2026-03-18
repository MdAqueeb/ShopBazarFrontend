import UserProfile from '../../features/user/UserProfile';
import { useAppSelector } from '../../store/hooks';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  return <UserProfile userId={user?.userId ?? 0} />;
}
