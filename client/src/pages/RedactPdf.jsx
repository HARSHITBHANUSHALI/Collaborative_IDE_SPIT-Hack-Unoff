import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Download, AlertTriangle, FileText, Shield } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { LANGUAGE_OPTIONS, ENTITY_TYPES } from '../utils/constants';

export default function RedactPdf() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedPdf, setProcessedPdf] = useState(null);
  const [language, setLanguage] = useState('en');
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setProcessedPdf(null);
      setError(null);
    } else {
      setError('Please select a PDF file');
    }
  };

  const handleEntityChange = (entity) => {
    setSelectedEntities(prev =>
      prev.includes(entity)
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
  };

  const handleRedactPdf = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('language', language);
    if (selectedEntities.length > 0) {
      formData.append('entities', JSON.stringify(selectedEntities));
    }
    formData.append('score_threshold', '0.4');
    formData.append('return_decision_process', 'true');

    try {
      const response = await fetch('http://naufil.r04nx.tech/redact-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'PDF redaction failed');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      setProcessedPdf(pdfUrl);
      setError(null);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedPdf && selectedFile) {
      const link = document.createElement('a');
      link.href = processedPdf;
      link.download = `redacted-${selectedFile.name}`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800 shadow-xl">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="text-3xl font-bold text-center text-white font-spaceGrotesk flex items-center justify-center">
                <Shield className="mr-2 h-6 w-6 text-blue-500" />
                PDF Redactor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Upload Section */}
              <motion.div 
                className="bg-gray-800/50 p-8 rounded-xl text-center border border-gray-700"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FileText className="h-12 w-12 text-blue-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Upload your PDF
                    </h3>
                    <p className="text-gray-400">
                      Select a PDF file to remove or mask sensitive content
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf"
                  className="hidden"
                />
              </motion.div>

              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg"
                >
                  <span className="text-gray-300">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setProcessedPdf(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* Settings Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Language Selection */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Document Language</Label>
                  <Select
                    value={language}
                    onValueChange={setLanguage}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-300">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {LANGUAGE_OPTIONS.map(lang => (
                        <SelectItem 
                          key={lang.value} 
                          value={lang.value}
                          className="text-gray-300 focus:bg-gray-700"
                        >
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Entity Selection */}
              <div className="space-y-3">
                <Label className="text-gray-300">Information to Redact</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ENTITY_TYPES.map(entity => (
                    <motion.div
                      key={entity}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedEntities.includes(entity) 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-gray-800/30 border-gray-700 text-gray-400'}
                      `}
                      onClick={() => handleEntityChange(entity)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={entity}
                          checked={selectedEntities.includes(entity)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <Label htmlFor={entity} className="cursor-pointer">
                          {entity.replace(/_/g, ' ')}
                        </Label>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleRedactPdf}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Redact PDF'}
                </Button>

                {error && (
                  <Alert variant="destructive" className="bg-red-900/50 border-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Results Section */}
              {(selectedFile || processedPdf) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  {/* File Cards... */}
                  {selectedFile && (
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-gray-300">Original PDF</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-48 rounded-md border border-gray-700">
                          <FileText className="h-12 w-12 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {processedPdf && (
                    <Card className="bg-gray-800/30 border-gray-700">
                      <CardHeader>
                        <CardTitle className="text-gray-300">Redacted PDF</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center h-48 rounded-md border border-gray-700">
                          <FileText className="h-12 w-12 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {/* Download Button */}
              {processedPdf && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Redacted PDF
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
