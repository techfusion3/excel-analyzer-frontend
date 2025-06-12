import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon, XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { uploadFile } from '../services/fileService';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setFiles(prev => [...prev, ...acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending'
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: true,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const removeFile = (fileId) => {
    setFiles(files => files.filter(f => f.id !== fileId));
    if (files.length === 1) {
      setError(null);
    }
  };

  const uploadFiles = async () => {
    setError(null);
    setUploading(true);
    let hasError = false;
    
    // Process each file
    for (const fileObj of files) {
      if (fileObj.status === 'completed') continue;

      try {
        console.log('Uploading file:', fileObj.file.name); // Debug log
        
        // Upload file and track progress
        await uploadFile(fileObj.file, (progress) => {
          console.log('Upload progress:', progress); // Debug log
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: progress
          }));
        });

        console.log('File uploaded successfully:', fileObj.file.name); // Debug log

        // Update file status to completed
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'completed', progress: 100 } 
            : f
        ));
      } catch (error) {
        console.error('Error uploading file:', fileObj.file.name, error);
        hasError = true;
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id 
            ? { ...f, status: 'error' } 
            : f
        ));
        setError(error.message || 'Failed to upload file. Please try again.');
      }
    }

    setUploading(false);
    
    // Navigate to dashboard only if all files were uploaded successfully
    if (!hasError && files.every(f => f.status === 'completed')) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Excel Files</h1>
        <p className="mt-2 text-gray-600">
          Upload your Excel files for analysis. Supported formats: .xlsx, .xls, .csv
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-600">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-4 text-lg text-gray-600">
          {isDragActive
            ? "Drop your files here"
            : "Drag & drop files here, or click to select"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Maximum file size: 50MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Selected Files</h2>
            <button
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.status === 'completed')}
              className={`px-4 py-2 rounded-lg text-white font-medium
                ${uploading || files.every(f => f.status === 'completed')
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {uploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

          <div className="space-y-3">
            {files.map((fileObj) => (
              <div 
                key={fileObj.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <DocumentIcon className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {fileObj.status === 'completed' ? (
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  ) : fileObj.status === 'error' ? (
                    <div className="text-red-500 text-sm">Upload failed</div>
                  ) : (
                    <>
                      {uploading && (
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                          />
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <XMarkIcon className="w-5 h-5 text-gray-500" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 