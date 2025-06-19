'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/app/page';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Error al cargar productos');
      }
      const data = await response.json();
      setProducts(data.map((p: any) => ({
        ...p,
        dateAdded: new Date(p.dateAdded),
        lastUpdated: new Date(p.lastUpdated)
      })));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Agregar producto
  const addProduct = async (productData: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Error al agregar producto');
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, {
        ...newProduct,
        dateAdded: new Date(newProduct.dateAdded),
        lastUpdated: new Date(newProduct.lastUpdated)
      }]);
      
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar producto');
      throw err;
    }
  };

  // Actualizar producto
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar producto');
      }

      setProducts(prev =>
        prev.map(product =>
          product.id === id
            ? { ...product, ...updates, lastUpdated: new Date() }
            : product
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
      throw err;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar producto');
      }

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}