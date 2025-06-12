import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { getFiles, getFileStructure, generateChart } from '../services/fileService';
import ExcelChart from '../components/ExcelChart';

const CHART_TYPES = {
  '2D': [
    { id: 'bar', label: 'Bar Chart', icon: '📊' },
    { id: 'line', label: 'Line Chart', icon: '📈' },
    { id: 'pie', label: 'Pie Chart', icon: '🥧' },
    { id: 'scatter', label: 'Scatter Plot', icon: '📍' },
    { id: 'area', label: 'Area Chart', icon: '🌊' }
  ],
  '3D': [
    { id: 'bar3d', label: '3D Bar Chart', icon: '📊' },
    { id: 'pie3d', label: '3D Pie Chart', icon: '🥧' },
    { id: 'scatter3d', label: '3D Scatter Plot', icon: '📍' }
  ]
};

export default function DataAnalysis() {
  const { fileId } = useParams();
  const [selectedFile, setSelectedFile] = useState(fileId || '');
  const [files, setFiles] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState('2D');
  const [selectedChartType, setSelectedChartType] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    title: '',
    xAxis: '',
    yAxis: '',
    aggregation: 'sum'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getFiles();
        console.log('Fetched files:', response); // Debug log
        setFiles(response);
        
        if (fileId) {
          setSelectedFile(fileId);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        setError('Failed to load files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [fileId]);

  // Fetch file structure when a file is selected
  useEffect(() => {
    const fetchFileStructure = async () => {
      if (!selectedFile) {
        setColumns([]);
        return;
      }

      try {
        const structure = await getFileStructure(selectedFile);
        setColumns(structure.columns);
      } catch (error) {
        console.error('Error fetching file structure:', error);
      }
    };

    fetchFileStructure();
  }, [selectedFile]);

  const validateConfig = () => {
    const errors = {};

    if (!selectedFile) {
      errors.file = 'Please select a file';
    }

    if (!selectedChartType) {
      errors.chartType = 'Please select a chart type';
    }

    if (!chartConfig.title.trim()) {
      errors.title = 'Please enter a chart title';
    }

    if (!chartConfig.xAxis) {
      errors.xAxis = 'Please select X-axis';
    }

    if (!chartConfig.yAxis) {
      errors.yAxis = 'Please select Y-axis';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerateChart = async () => {
    if (!validateConfig()) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateChart(selectedFile, {
        type: selectedChartType,
        dimension: selectedDimension,
        ...chartConfig
      });

      setChartData(response);
    } catch (error) {
      console.error('Error generating chart:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveChart = async () => {
    // Implement save functionality
  };

  const handleDownload = async (format) => {
    // Implement download functionality
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Analysis</h1>
        <p className="text-gray-600 mt-2">Configure and generate charts from your data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* File Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Select File</h3>
            <div className="space-y-4">
              <select
                value={selectedFile}
                onChange={(e) => setSelectedFile(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.file 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select a file</option>
                {files.map(file => (
                  <option 
                    key={file._id} 
                    value={file._id}
                  >
                    {file.filename} ({formatDate(file.uploadedAt)})
                  </option>
                ))}
              </select>
              {validationErrors.file && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  {validationErrors.file}
                </p>
              )}
            </div>
          </div>

          {/* Dimension Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Chart Dimension</h3>
            <div className="flex gap-4">
              {['2D', '3D'].map(dim => (
                <button
                  key={dim}
                  onClick={() => {
                    setSelectedDimension(dim);
                    setSelectedChartType(null);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    selectedDimension === dim
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {dim}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Chart Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {CHART_TYPES[selectedDimension].map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChartType(chart.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                    selectedChartType === chart.id
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-500'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{chart.icon}</span>
                  <span>{chart.label}</span>
                </button>
              ))}
            </div>
            {validationErrors.chartType && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <ExclamationCircleIcon className="w-4 h-4" />
                {validationErrors.chartType}
              </p>
            )}
          </div>

          {/* Chart Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Chart Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Title
                </label>
                <input
                  type="text"
                  value={chartConfig.title}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter chart title"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.title 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {validationErrors.title}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  X-Axis
                </label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, xAxis: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.xAxis 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select X-Axis</option>
                  {columns.map(col => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>
                {validationErrors.xAxis && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {validationErrors.xAxis}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Y-Axis
                </label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, yAxis: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.yAxis 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Y-Axis</option>
                  {columns.filter(col => col.type === 'number').map(col => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>
                {validationErrors.yAxis && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {validationErrors.yAxis}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aggregation
                </label>
                <select
                  value={chartConfig.aggregation}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, aggregation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="sum">Sum</option>
                  <option value="average">Average</option>
                  <option value="count">Count</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Preview and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Preview */}
          <div className="bg-white rounded-lg shadow p-6 min-h-[400px] flex items-center justify-center">
            {!chartData ? (
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Configure and generate a chart to preview</p>
              </div>
            ) : (
              <div className="w-full h-full">
                <ExcelChart
                  data={chartData.data}
                  chartType={selectedChartType}
                  xKey={chartConfig.xAxis}
                  yKey={chartConfig.yAxis}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleGenerateChart}
                disabled={isGenerating}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isGenerating
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                {isGenerating ? 'Generating...' : 'Generate Chart'}
              </button>

              <button
                onClick={() => handleDownload('png')}
                disabled={!chartData}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Download PNG
              </button>

              <button
                onClick={() => handleDownload('pdf')}
                disabled={!chartData}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                Download PDF
              </button>

              <button
                onClick={handleSaveChart}
                disabled={!chartData}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <ChartBarIcon className="w-5 h-5" />
                Save Chart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 