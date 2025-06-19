import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/googleSheets';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json();
    const newProduct = await addProduct(productData);
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    return NextResponse.json(
      { error: 'Error al agregar producto' },
      { status: 500 }
    );
  }
}