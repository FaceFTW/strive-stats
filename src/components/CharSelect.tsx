import * as React from 'react';
import {Character, CHARACTER_LIST} from './characters/charlist';
import './CharSelect.css';

export const CHARACTERS = Object.keys(CHARACTER_LIST);

interface CharSelectProps {}

interface CharSelectState {}

interface CharSelectItemProps {
	charCode: string;
}

interface CharSelectItemState extends Character {
	image: NodeRequire;
}

export class CharSelectItem extends React.Component<CharSelectItemProps, Character> {
	constructor(props: CharSelectItemProps) {
		super(props);
		this.state = CHARACTER_LIST[props.charCode];
	}
	render() {
		const image = require(`${this.state.charAsset}`);
		return (
			<>
				<span className='item-container'>
					<img className='item-img' src={image} />
					<span className='item-txt'>{this.state.charName}</span>
				</span>
			</>
		);
	}
}

class CharSelect extends React.Component<CharSelectProps, CharSelectState> {
	constructor(props: CharSelectProps) {
		super(props);
		this.state = {};
	}
	render() {
		return <></>;
	}
}

export default CharSelect;
