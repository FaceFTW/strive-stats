import React from 'react';
import {CHARACTER_LIST} from './characters/charlist';
import CharSelect, {CharSelectProps} from './CharSelect';

export default {
	title: 'Character Select',
	component: CharSelect,
};

const Template = (args: CharSelectProps) => <CharSelect {...args}></CharSelect>;

export const Primary = {
	args: {value: CHARACTER_LIST['SOL']},
};
