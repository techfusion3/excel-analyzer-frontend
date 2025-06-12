import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../redux/uiSlice';

export default function Sidebar() {
  const { user } = useSelector((state) => state.user);
  const { isSidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();

  const menuItems = [
    { title: 'Analytics Hub', path: '/analytics-hub', icon: '📊' },
    { title: 'Data Upload', path: '/upload', icon: '⬆️' },
    { title: 'Data Analysis', path: '/analysis', icon: '📈' },
    { title: 'My Reports', path: '/reports', icon: '📑' },
    { title: 'All Insights', path: '/insights', icon: '💡' },
    { title: 'Activity Log', path: '/activity', icon: '📝' },
  ];

  const getInitial = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names[0].charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 ease-in-out z-30 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-lg font-semibold shrink-0">
                {getInitial(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
} 