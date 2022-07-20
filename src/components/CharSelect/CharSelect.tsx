import {Box, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import {ThemeProvider} from '@mui/system';
import * as React from 'react';
import {CHARACTER_LIST} from '../characters/charlist';
import {appTheme} from '../theme';
import './CharSelect.css';

export const CHARACTERS = Object.keys(CHARACTER_LIST);

export interface CharSelectProps {
	value: string | null;
	label: string;
	onChange?: (event: SelectChangeEvent<string | null>, child: React.ReactNode) => void;
}

interface CharSelectState {}

const formatOptionLabel = (data: string | null) => {
	if (data) {
		const image = require(`../characters/${CHARACTER_LIST[data].charAsset}`);
		return (
			<>
				<Box sx={{display: 'flex', alignItems: 'flex-start'}}>
					<Box component='span' sx={{display: 'inline-flex', alignItems: 'flex-start'}}>
						<img className='select-item-img' src={image} />
						<Typography component='span' variant='h6' marginLeft='1rem' marginTop='0.5rem'>
							{CHARACTER_LIST[data].charName}
						</Typography>
					</Box>
				</Box>
			</>
		);
	}
};

export const CharSelect = (props: CharSelectProps) => {
	return (
		<>
			<ThemeProvider theme={appTheme}>
				<InputLabel id={`char-select-${props.label}-label`}>{props.label}</InputLabel>
				<Select
					labelId={`char-select-${props.label}-label`}
					id={`char-select-${props.label}`}
					value={props.value}
					onChange={props.onChange}
					renderValue={formatOptionLabel}
				>
					{CHARACTERS.map((character) => (
						<>
							<MenuItem value={character}>{formatOptionLabel(character)}</MenuItem>
						</>
					))}
				</Select>
			</ThemeProvider>
		</>
	);
};
