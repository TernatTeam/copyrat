import { extendTheme } from 'native-base';

const theme = extendTheme({
  colors: {
    primary1: {
      50: '#FFE1E1', // 35% lighten
      100: '#FFC8C8', // 25% lighten
      500: '#747474', // original
      600: '#686868', // 10% darker
    },
    primary2: {
      50: '#FFFFA9', // 35% lighten
      100: '#FFFF90', // 25% lighten
      500: '#F3D250', // original
      600: '#DAB937', // 10% darker
    },
    primary3: {
      50: '#F9F9F9', // 5% lighten
      500: '#ECECEC', // original
      600: '#D3D3D3', // 10% darker
    },
    primary4: {
      50: '#E9FFFF', // 35% lighten
      100: '#D0FFFF', // 25% lighten
      500: '#90CCF4', // original
      600: '#77B3DB', // 10% darker
    },
    primary5: {
      50: '#5EFFFF', // 35% lighten
      100: '#45FFFF', // 25% lighten
      500: '#05dad5', // original // #O5aad5 // #747474
      600: '#00C1BC', // 10% darker
    },

    // colors primary1:#05dad5
    // primary2: #ebf4fa
    // Redefinig only one shade, rest of the color will remain same.
    // amber: {
    //   400: '#d97706',
    // },
  },
  // config: {
  //   Changing initialColorMode to 'dark'
  //   initialColorMode: 'dark',
  // },
});

export default theme;
