'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scan, Camera, Keyboard, Check, AlertCircle, Video, VideoOff } from 'lucide-react';

interface ProductScannerProps {
  onProductScanned: (barcode: string) => void;
  onClose: () => void;
}

export function ProductScanner({ onProductScanned, onClose }: ProductScannerProps) {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [manualBarcode, setManualBarcode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Función para inicializar la cámara
  const initializeCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Solicitar permisos de cámara
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Usar cámara trasera si está disponible
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      // Iniciar el escaneo automático
      startBarcodeDetection();

    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      setHasPermission(false);
      setError('No se pudo acceder a la cámara. Verifica los permisos o usa el modo manual.');
      setIsScanning(false);
    }
  };

  // Función para detectar códigos de barras usando ZXing
  const startBarcodeDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      // Importar ZXing dinámicamente
      const { BrowserMultiFormatReader } = await import('@zxing/library');
      const codeReader = new BrowserMultiFormatReader();

      // Configurar el lector para escanear desde el video
      const result = await codeReader.decodeFromVideoDevice(
        undefined, // Usar dispositivo por defecto
        videoRef.current,
        (result, error) => {
          if (result) {
            // Código encontrado
            const barcode = result.getText();
            setIsScanning(false);
            stopCamera();
            onProductScanned(barcode);
          }
          if (error && !(error.name === 'NotFoundException')) {
            console.error('Error de escaneo:', error);
          }
        }
      );

    } catch (err) {
      console.error('Error al inicializar el escáner:', err);
      setError('Error al inicializar el escáner. Intenta con el modo manual.');
      setIsScanning(false);
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setIsScanning(false);
  };

  // Función para manejar el envío manual
  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onProductScanned(manualBarcode.trim());
    }
  };

  // Función para generar código simulado (fallback)
  const generateSimulatedBarcode = () => {
    const simulatedBarcode = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    onProductScanned(simulatedBarcode);
  };

  // Efectos
  useEffect(() => {
    if (scanMode === 'camera') {
      initializeCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMode]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {scanMode === 'camera' ? (
            <div className="space-y-4">
              {/* Camera Preview */}
              <div className="aspect-square bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Scanning Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-blue-500 w-64 h-32 relative">
                      <div className="absolute inset-0 border-2 border-blue-500 animate-pulse opacity-50"></div>
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
                    </div>
                  </div>
                )}

                {/* No Camera State */}
                {hasPermission === false && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                    <div className="text-center text-white">
                      <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Cámara no disponible</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Status */}
              <div className="text-center">
                {isScanning ? (
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Buscando código de barras...</span>
                  </div>
                ) : hasPermission === null ? (
                  <span className="text-sm text-gray-500">Solicitando permisos de cámara...</span>
                ) : hasPermission === false ? (
                  <span className="text-sm text-red-600">Permisos de cámara denegados</span>
                ) : (
                  <span className="text-sm text-gray-500">Cámara lista</span>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex space-x-2">
                <Button 
                  onClick={initializeCamera} 
                  disabled={isScanning}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Escaneando...
                    </>
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      {hasPermission === false ? 'Reintentar' : 'Iniciar Escaneo'}
                    </>
                  )}
                </Button>
                
                {/* Fallback button for testing */}
                <Button 
                  onClick={generateSimulatedBarcode}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Simular
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Instrucciones:</p>
                <ul className="text-xs space-y-1">
                  <li>• Apunta la cámara hacia el código de barras</li>
                  <li>• Mantén el código dentro del marco</li>
                  <li>• Asegúrate de tener buena iluminación</li>
                  <li>• El escaneo es automático</li>
                </ul>
              </div>
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
                  className="text-center text-lg tracking-wider font-mono"
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