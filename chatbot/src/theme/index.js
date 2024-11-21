import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    primary: {
      500: '#4a90e2',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#e9f0f7',
        color: '#333',
      },
    },
  },
});

export default theme;
