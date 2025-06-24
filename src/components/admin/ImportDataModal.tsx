import React, { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { importService } from '../../services/adminService';

interface ImportDataModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

interface ImportResult {
  imported: number;
  errors: number;
  errorDetails: string[];
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({ onClose, onImportComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'candidates' | 'exam_results' | 'survey_responses'>('candidates');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const importTypes = {
    candidates: {
      label: 'Candidate Profiles',
      description: 'Import candidate information including name, contact details, and profile data',
      requiredColumns: ['full_name', 'email'],
      optionalColumns: ['phone', 'linkedin_url', 'github_url', 'portfolio_url', 'resume_url', 'photo_url', 'role', 'skill_level', 'is_public']
    },
    exam_results: {
      label: 'Exam Results',
      description: 'Import exam scores and results for candidates',
      requiredColumns: ['candidate_email', 'exam_title', 'score', 'result_date'],
      optionalColumns: ['max_score', 'result_status', 'feedback']
    },
    survey_responses: {
      label: 'Survey Results',
      description: 'Import survey feedback and ratings from team leaders',
      requiredColumns: ['candidate_email', 'survey_type', 'rating'],
      optionalColumns: ['feedback', 'reviewer_name', 'submitted_at']
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is CSV
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please select a CSV file only. Excel files (.xlsx, .xls) are not supported. Please convert your file to CSV format first.');
        setSelectedFile(null);
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB. Please reduce the file size and try again.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setImportResult(null);
      setShowPreview(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const preview = await importService.previewFile(selectedFile, importType);
      setPreviewData(preview);
      setShowPreview(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview file. Please check that your CSV file is properly formatted.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await importService.importData(selectedFile, importType);
      setImportResult(result);
      
      if (result.imported > 0) {
        setSuccess(`Successfully imported ${result.imported} record${result.imported !== 1 ? 's' : ''}.`);
        onImportComplete();
      }
      
      if (result.errors > 0) {
        setError(`${result.errors} record${result.errors !== 1 ? 's' : ''} failed to import. See details below.`);
      }
      
      if (result.imported > 0 && result.errors === 0) {
        // Auto-close after successful import with no errors
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data. Please check your file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = importService.generateTemplate(importType);
    importService.downloadTemplate(template, `${importType}_template.csv`);
  };

  const currentType = importTypes[importType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary-900 flex items-center space-x-2">
              <Upload className="w-6 h-6" />
              <span>Import Data</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{error}</div>
                  {importResult && importResult.errorDetails.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Error Details:</div>
                      <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                        {importResult.errorDetails.slice(0, 10).map((detail, index) => (
                          <li key={index} className="text-error-600">• {detail}</li>
                        ))}
                        {importResult.errorDetails.length > 10 && (
                          <li className="text-error-500 italic">... and {importResult.errorDetails.length - 10} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{success}</span>
            </div>
          )}

          {/* Import Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Select Import Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(importTypes).map(([key, type]) => (
                <button
                  key={key}
                  onClick={() => setImportType(key as any)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    importType === key
                      ? 'border-secondary-600 bg-secondary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <h3 className="font-semibold text-primary-900 mb-2">{type.label}</h3>
                  <p className="text-sm text-neutral-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Template Download */}
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-primary-900 mb-1">Download CSV Template</h3>
                <p className="text-sm text-neutral-600">
                  Download a CSV template with the correct column structure for {currentType.label.toLowerCase()}
                </p>
              </div>
              <button
                onClick={downloadTemplate}
                className="flex items-center space-x-2 bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Template</span>
              </button>
            </div>
          </div>

          {/* Column Requirements */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">Column Requirements for {currentType.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Required Columns:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {currentType.requiredColumns.map(col => (
                    <li key={col} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <code className="bg-blue-100 px-2 py-1 rounded text-xs">{col}</code>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Optional Columns:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {currentType.optionalColumns.map(col => (
                    <li key={col} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <code className="bg-blue-100 px-2 py-1 rounded text-xs">{col}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              Select CSV File to Import
            </label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-neutral-400 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
                <p className="text-lg font-medium text-neutral-900 mb-2">
                  {selectedFile ? selectedFile.name : 'Choose a CSV file to upload'}
                </p>
                <p className="text-sm text-neutral-600">
                  Only CSV files are supported. Maximum file size: 10MB
                </p>
              </label>
            </div>
          </div>

          {/* Preview and Import Actions */}
          {selectedFile && (
            <div className="flex space-x-4">
              <button
                onClick={handlePreview}
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 border border-secondary-600 text-secondary-600 px-6 py-3 rounded-lg font-medium hover:bg-secondary-50 transition-colors disabled:opacity-50"
              >
                <FileText className="w-5 h-5" />
                <span>{loading ? 'Loading...' : 'Preview Data'}</span>
              </button>
              
              <button
                onClick={handleImport}
                disabled={loading || !selectedFile}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white px-6 py-3 rounded-lg font-medium hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span>{loading ? 'Importing...' : 'Import Data'}</span>
              </button>
            </div>
          )}

          {/* Data Preview */}
          {showPreview && previewData.length > 0 && (
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <h3 className="font-semibold text-primary-900">Data Preview (First 5 rows)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-100">
                    <tr>
                      {Object.keys(previewData[0] || {}).map(key => (
                        <th key={key} className="text-left py-2 px-4 text-sm font-medium text-neutral-700">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, cellIndex) => (
                          <td key={cellIndex} className="py-2 px-4 text-sm text-neutral-900">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import Results Summary */}
          {importResult && (
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <h3 className="font-semibold text-primary-900 mb-3">Import Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-success-100 rounded-lg">
                  <div className="text-2xl font-bold text-success-700">{importResult.imported}</div>
                  <div className="text-sm text-success-600">Successfully Imported</div>
                </div>
                <div className="text-center p-3 bg-error-100 rounded-lg">
                  <div className="text-2xl font-bold text-error-700">{importResult.errors}</div>
                  <div className="text-sm text-error-600">Failed to Import</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};