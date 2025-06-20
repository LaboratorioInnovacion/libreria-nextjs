'use client';

import { AppSettings } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings as SettingsIcon, 
  Percent, 
  DollarSign, 
  Bell, 
  Save,
  Info
} from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const CURRENCIES = [
  { value: '$', label: 'USD ($)' },
  { value: '€', label: 'EUR (€)' },
  { value: '£', label: 'GBP (£)' },
  { value: '¥', label: 'JPY (¥)' },
  { value: 'S/', label: 'PEN (S/)' },
  { value: 'Bs', label: 'BOB (Bs)' },
  { value: '$', label: 'ARS ($)' },
];

export function Settings({ settings, onUpdateSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    setHasChanges(false);
  };

  const resetSettings = () => {
    setLocalSettings(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 mobile-scroll">
      {/* Header */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
          <SettingsIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Configuración</h2>
          <p className="text-xs sm:text-sm text-gray-500">Personaliza la aplicación</p>
        </div>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            Tienes cambios sin guardar. No olvides guardar tu configuración.
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Settings */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
            Configuración de Precios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profit Margin */}
          <div className="space-y-2">
            <Label htmlFor="profitMargin" className="flex items-center text-sm">
              <Percent className="w-4 h-4 mr-2" />
              Margen de Ganancia
            </Label>
            <div className="flex items-center space-x-3">
              <Input
                id="profitMargin"
                type="number"
                min="0"
                max="1000"
                step="0.1"
                value={localSettings.profitMargin}
                onChange={(e) => handleSettingChange('profitMargin', parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 font-medium">%</span>
            </div>
            <p className="text-xs text-gray-500">
              Este porcentaje se aplicará automáticamente sobre el precio de costo para calcular el precio de venta
            </p>
            
            {/* Margin Preview */}
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-gray-700 mb-2">Ejemplo de cálculo:</p>
              <div className="space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Precio de costo:</span>
                  <span>{localSettings.currency}10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Margen ({localSettings.profitMargin}%):</span>
                  <span className="text-blue-600">+{localSettings.currency}{(10 * localSettings.profitMargin / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-900 border-t pt-1">
                  <span>Precio de venta:</span>
                  <span>{localSettings.currency}{(10 * (1 + localSettings.profitMargin / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label htmlFor="currency" className="text-sm">Moneda</Label>
            <Select
              value={localSettings.currency}
              onValueChange={(value) => handleSettingChange('currency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
            Alertas de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <Label htmlFor="lowStockAlert" className="text-sm">Alertas de Stock Bajo</Label>
              <p className="text-xs sm:text-sm text-gray-500">
                Recibe notificaciones cuando el stock de un producto esté por debajo del mínimo
              </p>
            </div>
            <Switch
              id="lowStockAlert"
              checked={localSettings.lowStockAlert}
              onCheckedChange={(checked) => handleSettingChange('lowStockAlert', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            Información de la App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Versión:</span>
              <span className="ml-2 font-medium">1.0.0</span>
            </div>
            <div>
              <span className="text-gray-500">Plataforma:</span>
              <span className="ml-2 font-medium">Web App</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <p className="font-medium mb-1">LibreStock - Sistema de Gestión de Inventario</p>
            <p>Diseñado específicamente para librerías y pequeños negocios. Todos los datos se almacenan en Google Sheets.</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Optimizado para móvil */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 sticky bottom-20 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-2">
        <Button
          variant="outline"
          onClick={resetSettings}
          disabled={!hasChanges}
          className="w-full sm:flex-1"
        >
          Descartar Cambios
        </Button>
        <Button
          onClick={saveSettings}
          disabled={!hasChanges}
          className="w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}