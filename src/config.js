export const mapConfig = {
  apiGoogle: process.env.REACT_APP_MAP_GOOGLE,
  apiMapBox: process.env.REACT_APP_MAP_MAPBOX,
};

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const cloudinaryConfig = {
  cloudinaryKey: process.env.REACT_APP_CLOUDINARY_KEY,
  cloudinaryPreset: process.env.REACT_APP_CLOUDINARY_PRESET,
  cloudinaryUrl: process.env.REACT_APP_CLOUDINARY_URL,
};

export const infuraApiKey = process.env.REACT_APP_INFURA_API_KEY;
export const infuraChainId = process.env.REACT_APP_INFURA_CHAIN_ID;

export const targetNetwork = process.env.REACT_APP_TARGET_NETWORK;
export const targetNetworkMsg = process.env.REACT_APP_TARGET_NETWORK_MSG;

export const bnbTargetNetwork = process.env.REACT_APP_BINANCE_TARGET_NETWORK;
export const bnbTargetNetworkMsg = process.env.REACT_APP_BINANCE_TARGET_NETWORK_MSG;

export const jsonServerUrl = process.env.REACT_APP_JSON_SERVER_URL;

export const admin = {
  addresses: process.env.REACT_APP_ADMIN_ADDRESSES,
};

export const googleAnalyticsConfig = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const SUCCESS = 1;
export const FAILURE = 0;
