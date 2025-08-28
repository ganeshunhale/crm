import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#274DF5',
    },
    secondary: {
      main: '#f48fb1',
    },
    button:{
      blue: '#158BF9',
      red:'#EB483F'
    }
  },
});

export default darkTheme;