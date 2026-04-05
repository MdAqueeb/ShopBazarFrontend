import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchSellerByUserId } from '../../store/slices/sellerSlice';
import Loader from '../../components/common/Loader';

export default function SellerGuard() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.seller.loading);
  const seller = useAppSelector((state) => state.seller.currentSeller);

  useEffect(() => {
    if (user?.userId && !seller) {
      dispatch(fetchSellerByUserId(user.userId));
    }
  }, [dispatch, user?.userId, seller]);

  const roleObj = user?.role;
  const roleName = typeof roleObj === 'string' ? roleObj : roleObj?.roleName;

  if (!roleObj || roleName !== 'SELLER') {
    return <Navigate to="/" replace />;
  }

  if (loading && !seller) {
    return <Loader fullPage text="Loading seller portal..." />;
  }

  return <Outlet />;
}
