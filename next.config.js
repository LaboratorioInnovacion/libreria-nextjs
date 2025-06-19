// ✅ Solución: remover output: 'export'
const nextConfig = {
  // output: 'export', ← 🔥 Eliminar o comentar esta línea
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
