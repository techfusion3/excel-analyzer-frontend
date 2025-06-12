import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  ClockIcon,
  ServerIcon,
  DocumentChartBarIcon,
  ArrowTrendingUpIcon,
  TableCellsIcon,
  BellIcon
} from '@heroicons/react/24/outline';

// Mock data until backend is ready
const MOCK_FILES = [
  { 
    _id: '1', 
    filename: 'sales_report_2024.xlsx', 
    uploadedAt: new Date().toISOString(),
    size: 2.4,
    status: 'analyzed'
  },
  { 
    _id: '2', 
    filename: 'inventory_q1.xlsx', 
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    size: 1.8,
    status: 'pending'
  },
  { 
    _id: '3', 
    filename: 'financial_analysis.xlsx', 
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    size: 3.2,
    status: 'analyzed'
  }
];

const MOCK_STORAGE = {
  used: 512,
  total: 1024,
  breakdown: {
    excel: 300,
    charts: 150,
    other: 62
  }
};

const MOCK_ACTIVITY = [
  {
    id: 1,
    type: 'file_upload',
    description: 'sales_report_2024.xlsx uploaded',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'analysis_complete',
    description: 'Analysis completed for inventory_q1.xlsx',
    timestamp: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 3,
    type: 'chart_created',
    description: 'New chart created from financial_analysis.xlsx',
    timestamp: new Date(Date.now() - 86400000).toISOString()
  }
];

const MOCK_METRICS = {
  totalFiles: 15,
  analyzedFiles: 12,
  totalCharts: 8,
  activeAnalyses: 2
};

export default function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [recentFiles, setRecentFiles] = useState([]);
  const [storageStats, setStorageStats] = useState({
    used: 0,
    total: 1024,
    breakdown: { excel: 0, charts: 0, other: 0 }
  });
  const [activities, setActivities] = useState([]);
  const [metrics, setMetrics] = useState({
    totalFiles: 0,
    analyzedFiles: 0,
    totalCharts: 0,
    activeAnalyses: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecentFiles(MOCK_FILES);
        setStorageStats(MOCK_STORAGE);
        setActivities(MOCK_ACTIVITY);
        setMetrics(MOCK_METRICS);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatStorage = (mb) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${Math.round(mb)} MB`;
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}</h2>
        <p className="text-gray-600 mt-2">Here's what's happening with your analytics today.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <p className="text-2xl font-bold">{metrics.totalFiles}</p>
            </div>
            <DocumentChartBarIcon className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Analyzed Files</p>
              <p className="text-2xl font-bold">{metrics.analyzedFiles}</p>
            </div>
            <ArrowTrendingUpIcon className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Charts</p>
              <p className="text-2xl font-bold">{metrics.totalCharts}</p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Analyses</p>
              <p className="text-2xl font-bold">{metrics.activeAnalyses}</p>
            </div>
            <TableCellsIcon className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Files Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Files</h3>
              <button 
                onClick={() => navigate('/upload')}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Upload New
              </button>
            </div>
          </div>
          <div className="p-6">
            {recentFiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No files uploaded yet</p>
            ) : (
              <div className="space-y-4">
                {recentFiles.map((file) => (
                  <div 
                    key={file._id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/analysis/${file._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <DocumentChartBarIcon className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">{file.filename}</p>
                        <p className="text-sm text-gray-500">
                          {file.size} MB • {formatTimeAgo(file.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          file.status === 'analyzed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {file.status === 'analyzed' ? 'Analyzed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Storage Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Storage</h3>
                <ServerIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">
                    {formatStorage(storageStats.used)} of {formatStorage(storageStats.total)} used
                  </span>
                  <span className="font-medium">
                    {Math.round((storageStats.used / storageStats.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Excel Files</span>
                  <span>{formatStorage(storageStats.breakdown.excel)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Charts</span>
                  <span>{formatStorage(storageStats.breakdown.charts)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other</span>
                  <span>{formatStorage(storageStats.breakdown.other)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <BellIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`mt-1 p-1 rounded-full 
                      ${activity.type === 'file_upload' ? 'bg-blue-100' : 
                        activity.type === 'analysis_complete' ? 'bg-green-100' : 
                        'bg-purple-100'}`}
                    >
                      {activity.type === 'file_upload' ? (
                        <ArrowUpTrayIcon className="w-4 h-4 text-blue-600" />
                      ) : activity.type === 'analysis_complete' ? (
                        <DocumentChartBarIcon className="w-4 h-4 text-green-600" />
                      ) : (
                        <ChartBarIcon className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => navigate('/upload')}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ArrowUpTrayIcon className="w-5 h-5" />
                Upload New File
              </button>
              <button 
                onClick={() => navigate('/analytics-hub')}
                className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <ChartBarIcon className="w-5 h-5" />
                Create Chart
              </button>
              <button 
                onClick={() => navigate('/analysis')}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                <TableCellsIcon className="w-5 h-5" />
                View All Analyses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}