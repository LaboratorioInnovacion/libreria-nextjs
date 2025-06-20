'use client';

import { Product, AppSettings } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  BookOpen,
  Layers,
  ShoppingCart
} from 'lucide-react';

interface DashboardProps {
  products: Product[];
  settings: AppSettings;
}

export function Dashboard({ products, settings }: DashboardProps) {
  // Calculate statistics
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.costPrice * product.stock), 0);
  const expectedRevenue = products.reduce((sum, product) => sum + (product.sellPrice * product.stock), 0);
  const potentialProfit = expectedRevenue - totalValue;
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const outOfStockProducts = products.filter(product => product.stock === 0);
  
  // Categories breakdown
  const categories = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const averageStock = totalProducts > 0 ? products.reduce((sum, p) => sum + p.stock, 0) / totalProducts : 0;

  return (
    <div className="space-y-4 sm:space-y-6 mobile-scroll">
      {/* Low Stock Alert */}
      {settings.lowStockAlert && lowStockProducts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800 text-sm">
            <strong>{lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''}</strong> con stock bajo.
            {outOfStockProducts.length > 0 && (
              <> <strong>{outOfStockProducts.length}</strong> producto{outOfStockProducts.length > 1 ? 's' : ''} agotado{outOfStockProducts.length > 1 ? 's' : ''}.</>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Stats Cards - Optimizado para móvil */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700 flex items-center">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate">Total Productos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-900">{totalProducts}</div>
            <p className="text-xs text-blue-600 mt-1">En inventario</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-700 flex items-center">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate">Valor Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-900">
              {settings.currency}{totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 mt-1">Costo invertido</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700 flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate">Ganancia Potencial</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-900">
              {settings.currency}{potentialProfit.toFixed(2)}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Margen {settings.profitMargin}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-700 flex items-center">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="truncate">Stock Bajo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-900">{lowStockProducts.length}</div>
            <p className="text-xs text-orange-600 mt-1">Requieren reposición</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg flex items-center">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            Categorías Principales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {topCategories.map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{category}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs flex-shrink-0">
                {count} producto{count > 1 ? 's' : ''}
              </Badge>
            </div>
          ))}
          {topCategories.length === 0 && (
            <p className="text-gray-500 text-center py-4 text-sm">No hay productos agregados aún</p>
          )}
        </CardContent>
      </Card>

      {/* Stock Level Overview */}
      {totalProducts > 0 && (
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Nivel de Stock Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Stock promedio por producto</span>
                <span>{averageStock.toFixed(1)} unidades</span>
              </div>
              <Progress 
                value={Math.min((averageStock / 100) * 100, 100)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>100+</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Low Stock Products */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center text-orange-600">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <Badge 
                      variant={product.stock === 0 ? "destructive" : "secondary"}
                      className={`text-xs ${product.stock === 0 ? "" : "bg-orange-100 text-orange-800"}`}
                    >
                      {product.stock === 0 ? 'Agotado' : `${product.stock} disponibles`}
                    </Badge>
                  </div>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  Y {lowStockProducts.length - 5} producto{lowStockProducts.length - 5 > 1 ? 's' : ''} más...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}