import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import SellerHeader from './SellerHeader';

export default function SellerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SellerSidebar />
      <div className="ml-60 flex flex-col min-h-screen transition-all duration-200">
        <SellerHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
