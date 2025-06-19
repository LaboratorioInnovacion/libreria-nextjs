'use client';

import { useState, useEffect } from 'react';
import { Product, AppSettings } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Package, DollarSign, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  onCancel: () => void;
  calculateSellPrice: (costPrice: number) => number;
  settings: AppSettings;
}

const CATEGORIES = [
  'Ficción',
  'No Ficción',
  'Académico',
  'Infantil',
  'Juvenil',
  'Historia',
  'Ciencia',
  'Arte',
  'Biografía',
  'Autoayuda',
  'Poesía',
  'Teatro',
  'Cómics',
  'Revistas',
  'Otros'
];

export function ProductForm({ 
  product, 
  onSubmit, 
  onCancel, 
  calculateSellPrice, 
  settings 
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    category: product?.category || '',
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatedSellPrice, setCalculatedSellPrice] = useState(0);

  useEffect(() => {
    if (formData.costPrice > 0) {
      setCalculatedSellPrice(calculateSellPrice(formData.costPrice));
    } else {
      setCalculatedSellPrice(0);
    }
  }, [formData.costPrice, calculateSellPrice]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.barcode.trim()) {
      newErrors.barcode = 'El código de barras es obligatorio';
    } else if (formData.barcode.length < 8) {
      newErrors.barcode = 'El código debe tener al menos 8 dígitos';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (formData.costPrice <= 0) {
      newErrors.costPrice = 'El precio de costo debe ser mayor a 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    if (formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        sellPrice: calculatedSellPrice,
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const profit = calculatedSellPrice - formData.costPrice;
  const profitMargin = formData.costPrice > 0 ? ((profit / formData.costPrice) * 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: El Quijote - Miguel de Cervantes"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Barcode */}
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="1234567890123"
                className={`text-center tracking-wider ${errors.barcode ? 'border-red-500' : ''}`}
              />
              {errors.barcode && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.barcode}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Cost Price */}
            <div className="space-y-2">
              <Label htmlFor="costPrice">Precio de Costo</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className={`pl-10 ${errors.costPrice ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.costPrice && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.costPrice}
                </p>
              )}
            </div>

            {/* Price Calculation Display */}
            {formData.costPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700 flex items-center">
                    <Calculator className="w-4 h-4 mr-1" />
                    Precio de Venta
                  </span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {settings.currency}{calculatedSellPrice.toFixed(2)}
                  </Badge>
                </div>
                <div className="text-xs text-blue-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Costo:</span>
                    <span>{settings.currency}{formData.costPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ganancia:</span>
                    <span className="text-green-600">+{settings.currency}{profit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Margen:</span>
                    <span>{profitMargin.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Actual</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-xs text-red-600">{errors.stock}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                  placeholder="5"
                  className={errors.minStock ? 'border-red-500' : ''}
                />
                {errors.minStock && (
                  <p className="text-xs text-red-600">{errors.minStock}</p>
                )}
              </div>
            </div>

            {/* Stock Warning */}
            {formData.stock > 0 && formData.stock <= formData.minStock && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Stock bajo - considera reabastecer este producto
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {product ? 'Actualizar' : 'Agregar'} Producto
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}