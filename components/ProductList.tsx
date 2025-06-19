'use client';

import { useState } from 'react';
import { Product, AppSettings } from '@/app/page';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  DollarSign,
  Hash
} from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onUpdateProduct: (id: string, data: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  calculateSellPrice: (costPrice: number) => number;
  settings: AppSettings;
}

export function ProductList({ 
  products, 
  onUpdateProduct, 
  onDeleteProduct, 
  calculateSellPrice, 
  settings 
}: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && product.stock <= product.minStock) ||
                        (stockFilter === 'out' && product.stock === 0) ||
                        (stockFilter === 'available' && product.stock > product.minStock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleEditProduct = (productData: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, {
        ...productData,
        sellPrice: calculateSellPrice(productData.costPrice),
      });
      setEditingProduct(null);
    }
  };

  const getStockBadge = (product: Product) => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Agotado</Badge>;
    } else if (product.stock <= product.minStock) {
      return <Badge className="bg-orange-100 text-orange-800">Stock bajo</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex space-x-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Todo el stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el stock</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="out">Agotado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {filteredProducts.length} de {products.length} productos
            </span>
            {(searchTerm || categoryFilter !== 'all' || stockFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStockFilter('all');
                }}
                className="text-blue-600 hover:text-blue-700"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="space-y-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-white border border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">
                      {product.name}
                    </h3>
                    {getStockBadge(product)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Hash className="w-4 h-4 mr-1" />
                      <span className="font-mono">{product.barcode}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600">
                      <Package className="w-4 h-4 mr-1" />
                      <span>{product.category}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Costo:</span>
                        <span className="ml-1 font-medium">{settings.currency}{product.costPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Venta:</span>
                        <span className="ml-1 font-medium text-green-600">{settings.currency}{product.sellPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-500">Stock:</span>
                        <span className={`ml-1 font-medium ${
                          product.stock === 0 ? 'text-red-600' :
                          product.stock <= product.minStock ? 'text-orange-600' :
                          'text-gray-900'
                        }`}>
                          {product.stock} unidades
                        </span>
                        {product.stock <= product.minStock && product.stock > 0 && (
                          <AlertTriangle className="w-4 h-4 ml-1 text-orange-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400">
                        Mín: {product.minStock}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Ganancia por unidad:</span>
                        <span className="text-green-600 font-medium">
                          +{settings.currency}{(product.sellPrice - product.costPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                        className="w-full"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                      <ProductForm
                        product={editingProduct || undefined}
                        onSubmit={handleEditProduct}
                        onCancel={() => setEditingProduct(null)}
                        calculateSellPrice={calculateSellPrice}
                        settings={settings}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {products.length === 0 ? 'No hay productos' : 'No se encontraron productos'}
              </h3>
              <p className="text-gray-500">
                {products.length === 0 
                  ? 'Agrega tu primer producto usando el botón + en la parte superior'
                  : 'Prueba ajustando los filtros de búsqueda'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}