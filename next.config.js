module.exports = {
  reactStrictMode: false,
  env: {
    ERC_Contract: process.env.ERC_Contract,
    thirdwebApiKey: process.env.thirdwebApiKey,
    factoryAddress: process.env.factoryAddress,
    Marketplace_Contract: process.env.Marketplace_Contract,
    private_Key: process.env.private_Key,
    SECRET_RECOVERY_PHRASE: process.env.SECRET_RECOVERY_PHRASE,
    thirdweb_CLIENTID: process.env.thirdweb_CLIENTID,
    thirdweb_SecretKey: process.env.thirdweb_SecretKey,
    STRAPI_URL_PROD: process.env.STRAPI_URL_PROD,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
