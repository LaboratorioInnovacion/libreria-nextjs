'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Camera, Keyboard, Check } from 'lucide-react';

interface ProductScannerProps {
  onProductScanned: (barcode: string) => void;
  onClose: () => void;
}

export function ProductScanner({ onProductScanned, onClose }: ProductScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Simulate camera scanning
  const startCameraScanning = () => {
    setIsScanning(true);
    // Simulate scanning delay
    setTimeout(() => {
      const simulatedBarcode = generateSimulatedBarcode();
      setIsScanning(false);
      onProductScanned(simulatedBarcode);
    }, 2000);
  };

  const generateSimulatedBarcode = () => {
    // Generate a random 13-digit barcode (EAN-13 format)
    return Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onProductScanned(manualBarcode.trim());
    }
  };

  useEffect(() => {
    if (scanMode === 'camera') {
      startCameraScanning();
    }
  }, [scanMode]);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Scan className="w-5 h-5 mr-2 text-blue-600" />
            Escanear Código de Barras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex space-x-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              onClick={() => setScanMode('camera')}
              className="flex-1"
              size="sm"
            >
              <Camera className="w-4 h-4 mr-2" />
              Cámara
            </Button>
            <Button
              variant={scanMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setScanMode('manual')}
              className="flex-1"
              size="sm"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Manual
            </Button>
          </div>

          {scanMode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera Preview Simulation */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <Camera className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-gray-600 mt-3">Escaneando...</p>
                    <div className="absolute inset-0 border-4 border-blue-500 opacity-50 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Vista previa de cámara</p>
                    <p className="text-xs text-gray-400 mt-1">
                      (Simulación - se generará un código automáticamente)
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={startCameraScanning} 
                disabled={isScanning}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Escaneando...
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4 mr-2" />
                    Iniciar Escaneo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Ingresa el código de barras manualmente:
                </label>
                <Input
                  type="text"
                  placeholder="Ej: 1234567890123"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                  className="text-center text-lg tracking-wider"
                />
              </div>
              <Button 
                onClick={handleManualSubmit}
                disabled={!manualBarcode.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Código
              </Button>
            </div>
          )}

          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}