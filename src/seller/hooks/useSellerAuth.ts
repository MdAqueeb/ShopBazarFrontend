import { useAppSelector } from '../../store/hooks';

export default function useSellerAuth() {
  const user = useAppSelector((state) => state.auth.user);
  const seller = useAppSelector((state) => state.seller.currentSeller);
  const loading = useAppSelector((state) => state.seller.loading);

  return {
    userId: user?.userId ?? null,
    sellerId: seller?.sellerId ?? null,
    seller,
    user,
    loading,
  };
}
