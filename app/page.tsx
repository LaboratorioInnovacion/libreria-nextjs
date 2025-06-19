'use client';

import { useState } from 'react';
import { ProductScanner } from '@/components/ProductScanner';
import { ProductForm } from '@/components/ProductForm';
import { ProductList } from '@/components/ProductList';
import { Dashboard } from '@/components/Dashboard';
import { Settings } from '@/components/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, BarChart3, Settings as SettingsIcon, Plus, Scan, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useProducts } from '@/hooks/useProducts';

export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  dateAdded: Date;
  lastUpdated: Date;
}

export interface AppSettings {
  profitMargin: number;
  currency: string;
  lowStockAlert: boolean;
}

export default function Home() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const [settings, setSettings] = useState<AppSettings>({
    profitMargin: 30,
    currency: '$',
    lowStockAlert: true,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const calculateSellPrice = (costPrice: number) => {
    return costPrice * (1 + settings.profitMargin / 100);
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    try {
      await addProduct({
        ...productData,
        sellPrice: calculateSellPrice(productData.costPrice),
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await updateProduct(id, {
        ...productData,
        sellPrice: productData.costPrice ? calculateSellPrice(productData.costPrice) : undefined,
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 -mx-4 px-4 py-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LibreStock</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">Gestión de Inventario</p>
                  {error ? (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Wifi className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={showScanner} onOpenChange={setShowScanner}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="rounded-full">
                    <Scan className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <ProductScanner
                    onProductScanned={(barcode) => {
                      setShowScanner(false);
                      setShowAddProduct(true);
                    }}
                    onClose={() => setShowScanner(false)}
                  />
                </DialogContent>
              </Dialog>
              <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    <Plus className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                  <ProductForm
                    onSubmit={handleAddProduct}
                    onCancel={() => setShowAddProduct(false)}
                    calculateSellPrice={calculateSellPrice}
                    settings={settings}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <WifiOff className="w-4 h-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error de conexión:</strong> {error}. Los datos se mostrarán cuando se restablezca la conexión.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos desde Google Sheets...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard products={products} settings={settings} />
            </TabsContent>
            
            <TabsContent value="products" className="mt-0">
              <ProductList
                products={products}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                calculateSellPrice={calculateSellPrice}
                settings={settings}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Settings
                settings={settings}
                onUpdateSettings={setSettings}
              />
            </TabsContent>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50">
              <TabsList className="grid w-full grid-cols-3 bg-transparent p-2">
                <TabsTrigger
                  value="dashboard"
                  className="flex flex-col items-center space-y-1 py-3 rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs font-medium">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="flex flex-col items-center space-y-1 py-3 rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <Package className="w-5 h-5" />
                  <span className="text-xs font-medium">Productos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex flex-col items-center space-y-1 py-3 rounded-xl data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="text-xs font-medium">Ajustes</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}