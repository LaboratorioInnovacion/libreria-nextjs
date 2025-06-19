'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileSpreadsheet, 
  Key, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Copy
} from 'lucide-react';

interface GoogleSheetsSetupProps {
  onSetupComplete: () => void;
}

export function GoogleSheetsSetup({ onSetupComplete }: GoogleSheetsSetupProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    spreadsheetId: '',
    clientEmail: '',
    privateKey: '',
  });
  const [isValidating, setIsValidating] = useState(false);

  const validateConfiguration = async () => {
    setIsValidating(true);
    // Aquí podrías hacer una validación real de la configuración
    setTimeout(() => {
      setIsValidating(false);
      onSetupComplete();
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <FileSpreadsheet className="w-6 h-6 mr-2 text-green-600" />
            Configuración de Google Sheets
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Para usar Google Sheets como base de datos, necesitas configurar las credenciales de la API de Google.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Paso 1: Crear un proyecto en Google Cloud</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Ve a <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google Cloud Console <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                  <li>Crea un nuevo proyecto o selecciona uno existente</li>
                  <li>Habilita la API de Google Sheets</li>
                  <li>Ve a "Credenciales" y crea una cuenta de servicio</li>
                  <li>Descarga el archivo JSON de credenciales</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Paso 2: Crear tu Google Sheet</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Crea una nueva hoja de cálculo en <a href="https://sheets.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center">Google Sheets <ExternalLink className="w-3 h-3 ml-1" /></a></li>
                  <li>Nombra la primera hoja como "Productos"</li>
                  <li>Comparte la hoja con el email de la cuenta de servicio (con permisos de editor)</li>
                  <li>Copia el ID de la hoja desde la URL</li>
                </ol>
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Continuar con la configuración
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Paso 3: Configurar credenciales</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="spreadsheetId" className="flex items-center">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    ID de la Hoja de Cálculo
                  </Label>
                  <Input
                    id="spreadsheetId"
                    placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                    value={config.spreadsheetId}
                    onChange={(e) => setConfig(prev => ({ ...prev, spreadsheetId: e.target.value }))}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Copia el ID desde la URL de tu Google Sheet
                  </p>
                </div>

                <div>
                  <Label htmlFor="clientEmail" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email de la Cuenta de Servicio
                  </Label>
                  <Input
                    id="clientEmail"
                    placeholder="tu-servicio@tu-proyecto.iam.gserviceaccount.com"
                    value={config.clientEmail}
                    onChange={(e) => setConfig(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="privateKey" className="flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    Clave Privada
                  </Label>
                  <Textarea
                    id="privateKey"
                    placeholder="-----BEGIN PRIVATE KEY-----&#10;Tu clave privada aquí&#10;-----END PRIVATE KEY-----"
                    value={config.privateKey}
                    onChange={(e) => setConfig(prev => ({ ...prev, privateKey: e.target.value }))}
                    className="font-mono text-xs"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Copia la clave privada completa desde el archivo JSON
                  </p>
                </div>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Variables de entorno necesarias:</strong>
                  <div className="mt-2 space-y-1 font-mono text-xs bg-yellow-100 p-2 rounded">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_GOOGLE_SHEETS_ID={config.spreadsheetId}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`NEXT_PUBLIC_GOOGLE_SHEETS_ID=${config.spreadsheetId}`)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GOOGLE_SHEETS_CLIENT_EMAIL={config.clientEmail}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`GOOGLE_SHEETS_CLIENT_EMAIL=${config.clientEmail}`)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GOOGLE_SHEETS_PRIVATE_KEY="..."</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(`GOOGLE_SHEETS_PRIVATE_KEY="${config.privateKey}"`)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Volver
                </Button>
                <Button 
                  onClick={validateConfiguration}
                  disabled={!config.spreadsheetId || !config.clientEmail || !config.privateKey || isValidating}
                  className="flex-1"
                >
                  {isValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Validando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Validar y Continuar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}