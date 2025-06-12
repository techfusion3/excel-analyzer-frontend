import React, { useState, useEffect } from 'react';
import ExcelChart from '../components/ExcelChart';
import {
  ChartBarIcon,
  TableCellsIcon,
  DocumentIcon,
  AdjustmentsHorizontalIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

// Enhanced mock data with metric types
const MOCK_ANALYTICS = {
  totalFiles: 156,
  totalCharts: 42,
  recentAnalyses: [
    { 
      id: 1, 
      name: 'Sales Performance Q1', 
      type: 'line', 
      date: '2024-03-15', 
      views: 45, 
      status: 'completed',
      metricType: 'sales',
      metrics: {
        value: '$45,678',
        change: '+15%',
        previousValue: '$39,720'
      }
    },
    { 
      id: 2, 
      name: 'Inventory Trends', 
      type: 'bar', 
      date: '2024-03-14', 
      views: 32, 
      status: 'in_progress',
      metricType: 'inventory',
      metrics: {
        value: '1,234 units',
        change: '-8%',
        previousValue: '1,341 units'
      }
    },
    { 
      id: 3, 
      name: 'Revenue Analysis', 
      type: 'pie', 
      date: '2024-03-13', 
      views: 28, 
      status: 'completed',
      metricType: 'revenue',
      metrics: {
        value: '$156,789',
        change: '+12%',
        previousValue: '$139,991'
      }
    },
    { 
      id: 4, 
      name: 'Monthly Sales Report', 
      type: 'line', 
      date: '2024-03-12', 
      views: 56, 
      status: 'completed',
      metricType: 'sales',
      metrics: {
        value: '$67,890',
        change: '+9%',
        previousValue: '$62,284'
      }
    },
    { 
      id: 5, 
      name: 'Quarterly Revenue', 
      type: 'bar', 
      date: '2024-03-11', 
      views: 42, 
      status: 'completed',
      metricType: 'revenue',
      metrics: {
        value: '$789,012',
        change: '+18%',
        previousValue: '$668,655'
      }
    },
    { 
      id: 6, 
      name: 'Stock Level Analysis', 
      type: 'line', 
      date: '2024-03-10', 
      views: 35, 
      status: 'in_progress',
      metricType: 'inventory',
      metrics: {
        value: '2,567 units',
        change: '+5%',
        previousValue: '2,445 units'
      }
    }
  ],
  popularMetrics: [
    { id: 1, name: 'Total Revenue', growth: '+12.5%', trend: 'up', value: '$156,789' },
    { id: 2, name: 'Average Sales', growth: '+8.2%', trend: 'up', value: '$2,345' },
    { id: 3, name: 'Inventory Turnover', growth: '-2.1%', trend: 'down', value: '4.5x' }
  ],
  sampleChartData: [
    { month: 'Jan', value: 65, forecast: 63 },
    { month: 'Feb', value: 75, forecast: 72 },
    { month: 'Mar', value: 85, forecast: 82 },
    { month: 'Apr', value: 72, forecast: 75 },
    { month: 'May', value: 92, forecast: 88 }
  ],
  trendAnalysis: {
    seasonality: 'Positive',
    correlation: 0.85,
    confidence: 92,
    predictions: [
      { period: 'Jun', value: 95 },
      { period: 'Jul', value: 98 },
      { period: 'Aug', value: 103 }
    ]
  }
};

export default function AnalyticsHub() {
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS);
  const [filteredAnalyses, setFilteredAnalyses] = useState(MOCK_ANALYTICS.recentAnalyses);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [showForecast, setShowForecast] = useState(false);
  const [activeMetricFilter, setActiveMetricFilter] = useState('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalytics(MOCK_ANALYTICS);
        setFilteredAnalyses(MOCK_ANALYTICS.recentAnalyses);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Filter analyses when metric filter changes
  useEffect(() => {
    const filterAnalyses = () => {
      if (activeMetricFilter === 'all') {
        setFilteredAnalyses(analytics.recentAnalyses);
      } else {
        const filtered = analytics.recentAnalyses.filter(
          analysis => analysis.metricType === activeMetricFilter
        );
        setFilteredAnalyses(filtered);
      }
    };

    filterAnalyses();
  }, [activeMetricFilter, analytics.recentAnalyses]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const metricFilters = [
    { value: 'all', label: 'All Metrics', icon: '📊' },
    { value: 'revenue', label: 'Revenue', icon: '💰' },
    { value: 'sales', label: 'Sales', icon: '🛍️' },
    { value: 'inventory', label: 'Inventory', icon: '📦' }
  ];

  const getMetricSummary = (metricType) => {
    const relevantAnalyses = analytics.recentAnalyses.filter(
      analysis => analysis.metricType === metricType
    );
    
    if (relevantAnalyses.length === 0) return null;

    const totalChange = relevantAnalyses.reduce((acc, curr) => {
      const changeValue = parseFloat(curr.metrics.change);
      return acc + changeValue;
    }, 0);

    const avgChange = totalChange / relevantAnalyses.length;

    return {
      count: relevantAnalyses.length,
      avgChange: avgChange.toFixed(1) + '%'
    };
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderMetricFilterButton = (filter) => {
    const summary = filter.value !== 'all' ? getMetricSummary(filter.value) : null;
    
    return (
      <button
        key={filter.value}
        onClick={() => setActiveMetricFilter(filter.value)}
        className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all ${
          activeMetricFilter === filter.value
            ? 'bg-blue-100 text-blue-800 border border-blue-200'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
        }`}
      >
        <span className="mr-2">{filter.icon}</span>
        <span>{filter.label}</span>
        {summary && (
          <div className="ml-2 flex items-center">
            <span className="mx-1 text-gray-400">•</span>
            <span className={`text-xs font-medium ${
              parseFloat(summary.avgChange) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {summary.avgChange}
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header with Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Hub</h1>
          <p className="mt-2 text-gray-600">Your data insights at a glance</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowForecast(!showForecast)}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              showForecast ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700'
            }`}
          >
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
            Show Forecast
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Files Analyzed</h3>
            <DocumentIcon className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalFiles}</p>
          <p className="text-sm text-gray-500 mt-2">Total files processed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Charts Generated</h3>
            <ChartBarIcon className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.totalCharts}</p>
          <p className="text-sm text-gray-500 mt-2">Visualizations created</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Analyses</h3>
            <TableCellsIcon className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.recentAnalyses.length}</p>
          <p className="text-sm text-gray-500 mt-2">In the last 30 days</p>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Trend Analysis</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedChartType}
                onChange={(e) => setSelectedChartType(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="area">Area Chart</option>
              </select>
              <button
                onClick={() => {}} // Refresh data
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Seasonality</p>
              <p className="text-2xl font-bold text-blue-900">{analytics.trendAnalysis.seasonality}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Correlation</p>
              <p className="text-2xl font-bold text-green-900">{analytics.trendAnalysis.correlation}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Confidence</p>
              <p className="text-2xl font-bold text-purple-900">{analytics.trendAnalysis.confidence}%</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600 font-medium">Next Period</p>
              <p className="text-2xl font-bold text-orange-900">+{analytics.trendAnalysis.predictions[0].value}</p>
            </div>
          </div>
          <div className="h-[400px]">
            <ExcelChart
              data={analytics.sampleChartData}
              chartType={selectedChartType}
              xKey="month"
              yKey={showForecast ? ["value", "forecast"] : "value"}
            />
          </div>
        </div>
      </div>

      {/* Recent Analyses with Enhanced Filters */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Analyses</h2>
            <div className="flex flex-wrap items-center gap-2">
              {metricFilters.map(filter => renderMetricFilterButton(filter))}
            </div>
          </div>
          <div className="space-y-4">
            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No analyses found for the selected metric type.
              </div>
            ) : (
              filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      analysis.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800">{analysis.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(analysis.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{analysis.views} views</span>
                        <span>•</span>
                        <span className={`font-medium ${
                          parseFloat(analysis.metrics.change) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {analysis.metrics.change}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                      {analysis.type} chart
                    </span>
                    <button 
                      className="p-2 text-gray-500 hover:text-gray-700"
                      onClick={() => {
                        // Handle analysis settings
                        console.log('Opening settings for:', analysis.name);
                      }}
                    >
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Metrics with Enhanced UI */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Popular Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analytics.popularMetrics.map((metric) => (
              <div
                key={metric.id}
                className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{metric.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    metric.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {metric.growth}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className="text-gray-600">vs previous period</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 