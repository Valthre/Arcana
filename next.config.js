/** @type {import('next').NextConfig} */
const nextConfig = {
  // OBRIGATÓRIO PARA CAPACITOR (Gera a pasta /out)
  output: 'export',

  // OBRIGATÓRIO PARA EXPORTAÇÃO ESTÁTICA
  images: {
    unoptimized: true
  },

  // Corrige o aviso de Cross-Origin no ambiente de desenvolvimento
  allowedDevOrigins: [
    'https://*.cloudworkstations.dev'
  ]
};

module.exports = nextConfig;
