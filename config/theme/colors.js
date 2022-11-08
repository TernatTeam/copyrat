import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    // grey
    primary1: {
      100: '#9e9e9e', // 30% lighten
      200: '#909090', // 20% lighten
      300: '#747474', // original
      400: '#686868', // 10% darker
    },
    // yellow
    primary2: {
      100: '#fbf695', // 30% lighten
      200: '#fbf585', // 20% lighten
      300: '#faf267', // original
      400: '#f9ef45', // 10% darker
    },
    //blue
    primary3: {
      100: '#e4f2fa', // 30% lighten
      200: '#e0f0f9', // 20% lighten
      225: '#daedf8', // 5% lighten
      300: '#d8ecf8', // original
      400: '#b1d9f1', // 10% darker
      500: '#89c6ea', // 20% darker
    },
    //red
    primary4: {
      100: '#e98888', // 30% lighten
      200: '#e67777', // 20% lighten
      300: '#e05555', // original
      400: '#db3b3b', // 10% darker
    },
  },
  // config: {
  //   Changing initialColorMode to 'dark'
  //   initialColorMode: 'dark',
  // },
});

export default theme;
