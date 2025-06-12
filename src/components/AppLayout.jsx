import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main 
          className={`flex-1 min-h-[calc(100vh-4rem)] mt-16 bg-white p-8 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
} 