import {Box, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {ThemeProvider} from '@mui/system';
import {CHARACTER_LIST} from '../characters/charlist';
import {appTheme} from '../theme';
import './CharSelect.css';

export const CHARACTERS = Object.keys(CHARACTER_LIST);

export interface CharSelectProps {
	value: string;
	label: string;
	onChange?: (event: SelectChangeEvent<string | null>) => void;
}

const formatOptionLabel = (data: string) => {
	if (data) {
		const image = require(`../characters/${CHARACTER_LIST[data].charAsset}`);
		return (
			<Box sx={{display: 'flex', alignItems: 'flex-start'}}>
				<Box component='span' sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
					<img className='select-item-img' src={image} alt={data} />
					<Typography component='span' variant='body1' marginLeft='1rem' marginTop='0.75rem'>
						{CHARACTER_LIST[data].charName}
					</Typography>
				</Box>
			</Box>
		);
	}
};

export const CharSelect = (props: CharSelectProps) => {
	return (
		<>
			<ThemeProvider theme={appTheme}>
				<Select
					label={props.label}
					id={`char-select-${props.label}`}
					value={props.value}
					onChange={props.onChange}
					renderValue={formatOptionLabel}
					sx={{width: '14rem', height: '4rem'}}
				>
					{CHARACTERS.map((character) => (
						<MenuItem key={character} value={character}>
							{formatOptionLabel(character)}
						</MenuItem>
					))}
				</Select>
			</ThemeProvider>
		</>
	);
};
