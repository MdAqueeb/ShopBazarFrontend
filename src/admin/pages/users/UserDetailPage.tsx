import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useAppSelector } from '../../../store/hooks';
import StatusBadge from '../../components/StatusBadge';

export default function UserDetailPage() {
  const { userId } = useParams();
  const { users } = useAppSelector((state) => state.admin);

  const user = users?.content.find((u) => u.userId === Number(userId));

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">User not found. Go back to the</p>
        <Link to="/admin/users" className="text-violet-600 hover:underline">user list</Link>.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={16} />
        Back to Users
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">User ID: #{user.userId}</p>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{user.phone ?? 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Role</p>
              <p className="font-medium text-gray-900">{user.role?.roleName ?? 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar size={16} className="text-gray-400" />
            <div>
              <p className="text-gray-500">Joined</p>
              <p className="font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {user.blockReason && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm font-medium text-red-700">Block Reason</p>
            <p className="text-sm text-red-600 mt-0.5">{user.blockReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}
