import {createTheme, ThemeOptions} from '@mui/material/styles';

const themeOptions: ThemeOptions = {
	palette: {
		primary: {
			main: '#570602',
		},
		secondary: {
			main: '#f50057',
		},
	},
};

export const appTheme = createTheme(themeOptions);
