import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Store, Hash } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import StatusBadge from '../../components/StatusBadge';

export default function SellerDetailPage() {
  const { sellerId } = useParams();
  const { sellers } = useAppSelector((state) => state.admin);

  const seller = sellers?.content.find((s) => s.sellerId === Number(sellerId));

  if (!seller) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Seller not found. Go back to the</p>
        <Link to="/admin/sellers" className="text-violet-600 hover:underline">seller list</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/sellers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />
        Back to Sellers
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{seller.storeName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Seller ID: #{seller.sellerId}</p>
          </div>
          <StatusBadge status={seller.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{seller.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{seller.phone ?? 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Hash size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">GST Number</p>
              <p className="font-medium text-gray-900 font-mono">{seller.gstNumber ?? 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Store size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Description</p>
              <p className="font-medium text-gray-900">{seller.description ?? 'No description'}</p>
            </div>
          </div>
        </div>

        {seller.rejectionReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm font-medium text-red-700">Rejection Reason</p>
            <p className="text-sm text-red-600 mt-0.5">{seller.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
