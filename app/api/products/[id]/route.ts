import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/googleSheets';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    await updateProduct(params.id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en PUT /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error en DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}