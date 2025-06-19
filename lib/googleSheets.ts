import { google } from 'googleapis';

// Configuración de Google Sheets
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';
const SHEET_NAME = 'Productos';
const RANGE = `${SHEET_NAME}!A:J`;

// Configurar autenticación
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

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

// Función para obtener todos los productos
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    
    // Saltar la primera fila (headers)
    if (rows.length <= 1) return [];

    return rows.slice(1).map((row, index) => ({
      id: row[0] || `product_${index}`,
      name: row[1] || '',
      barcode: row[2] || '',
      category: row[3] || '',
      costPrice: parseFloat(row[4]) || 0,
      sellPrice: parseFloat(row[5]) || 0,
      stock: parseInt(row[6]) || 0,
      minStock: parseInt(row[7]) || 5,
      dateAdded: row[8] ? new Date(row[8]) : new Date(),
      lastUpdated: row[9] ? new Date(row[9]) : new Date(),
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// Función para agregar un producto
export async function addProduct(product: Omit<Product, 'id' | 'dateAdded' | 'lastUpdated'>): Promise<Product> {
  try {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      dateAdded: new Date(),
      lastUpdated: new Date(),
    };

    const values = [
      [
        newProduct.id,
        newProduct.name,
        newProduct.barcode,
        newProduct.category,
        newProduct.costPrice,
        newProduct.sellPrice,
        newProduct.stock,
        newProduct.minStock,
        newProduct.dateAdded.toISOString(),
        newProduct.lastUpdated.toISOString(),
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return newProduct;
  } catch (error) {
    console.error('Error al agregar producto:', error);
    throw error;
  }
}

// Función para actualizar un producto
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    // Primero obtener todos los productos para encontrar la fila
    const products = await getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct = { ...products[productIndex], ...updates, lastUpdated: new Date() };
    const rowIndex = productIndex + 2; // +2 porque empezamos desde la fila 2 (después del header)

    const values = [
      [
        updatedProduct.id,
        updatedProduct.name,
        updatedProduct.barcode,
        updatedProduct.category,
        updatedProduct.costPrice,
        updatedProduct.sellPrice,
        updatedProduct.stock,
        updatedProduct.minStock,
        updatedProduct.dateAdded.toISOString(),
        updatedProduct.lastUpdated.toISOString(),
      ]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowIndex}:J${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
}

// Función para eliminar un producto
export async function deleteProduct(id: string): Promise<void> {
  try {
    // Primero obtener todos los productos para encontrar la fila
    const products = await getProducts();
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const rowIndex = productIndex + 2; // +2 porque empezamos desde la fila 2

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Asumiendo que es la primera hoja
                dimension: 'ROWS',
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}

// Función para inicializar la hoja con headers
export async function initializeSheet(): Promise<void> {
  try {
    const headers = [
      'ID',
      'Nombre',
      'Código de Barras',
      'Categoría',
      'Precio Costo',
      'Precio Venta',
      'Stock',
      'Stock Mínimo',
      'Fecha Agregado',
      'Última Actualización'
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:J1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });
  } catch (error) {
    console.error('Error al inicializar la hoja:', error);
    throw error;
  }
}