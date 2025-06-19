import { NextRequest, NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/googleSheets';

/**
 * Handler para actualizar un producto (PUT /api/products/[id])
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parsear los datos enviados en el cuerpo de la solicitud
    const updates = await request.json();

    // Validar que los datos enviados sean correctos
    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Datos inválidos para la actualización' },
        { status: 400 }
      );
    }

    // Llamar a la función para actualizar el producto
    await updateProduct(params.id, updates);

    // Responder con éxito
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error en PUT /api/products/${params.id}:`, error.message);
    return NextResponse.json(
      { error: 'Error al actualizar producto', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handler para eliminar un producto (DELETE /api/products/[id])
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Llamar a la función para eliminar el producto
    await deleteProduct(params.id);

    // Responder con éxito
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error en DELETE /api/products/${params.id}:`, error.message);
    return NextResponse.json(
      { error: 'Error al eliminar producto', details: error.message },
      { status: 500 }
    );
  }
}