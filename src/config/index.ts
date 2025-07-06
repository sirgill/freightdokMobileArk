// Environment configuration for mobile app
const isDevelopment = __DEV__;

const development = {
  apiUrl: 'http://localhost:5001',
  mailServerUrl: 'http://localhost:9999',
  goLangServerUrl: 'http://localhost:8080',
  babylonianGateUrl: 'http://localhost:5800',
};

const production = {
  apiUrl: 'https://api.freightdok.io',
  mailServerUrl: 'https://mail.freightdok.io',
  goLangServerUrl: 'https://go.freightdok.io',
  babylonianGateUrl: 'https://babylonian-gate.freightdok.io',
};

export const config = isDevelopment ? development : production;

// Helper functions
export const getApiUrl = () => config.apiUrl;
export const getMailServerUrl = () => config.mailServerUrl;
export const getGoLangServerUrl = () => config.goLangServerUrl;
export const getBabylonianGateUrl = () => config.babylonianGateUrl;

// Environment info
export const isProduction = () => !isDevelopment;
export const isDev = () => isDevelopment;

console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('API URL:', getApiUrl()); 