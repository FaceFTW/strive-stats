import {CharSelect, CharSelectProps} from '../modules/CharSelect';

export default {
	title: 'Character Select',
	component: CharSelect,
};

const Template = (args: CharSelectProps) => <CharSelect {...args}></CharSelect>;

// const [character, setCharacter] = React.useState('');

export const Primary = {
	args: {value: 'SOL', label: 'Player Character'},
};
