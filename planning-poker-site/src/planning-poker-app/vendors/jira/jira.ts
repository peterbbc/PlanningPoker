type Config = {
  CLIENT_ID: string;
  REDIRECT_URI: string;
};

const CONFIG: Config = {
  CLIENT_ID: '',
  REDIRECT_URI: '',
};
switch (process.env.GATSBY_ENV) {
  case 'local':
    CONFIG.CLIENT_ID = 'ocExOLEXUXCleDB1VxKtvYiWiTT9c5Vn';
    CONFIG.REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A8000%2Fjira-callback';
    break;
  case 'staging':
    CONFIG.CLIENT_ID = 'p0cSCOx9oHEpibjOv4MX72JiXVrUa0hA';
    CONFIG.REDIRECT_URI = 'https%3A%2F%2Fplanning-poker-staging.firebaseapp.com%2Fjira-callback';
    break;
  case 'production':
    CONFIG.CLIENT_ID = 'OxXvM2rpj0Yk1DkjQR5r5dL7zo5Pnbxt';
    CONFIG.REDIRECT_URI = 'https%3A%2F%2Fplanningpokeronline.com%2Fjira-callback';
    break;
}

export { CONFIG };
