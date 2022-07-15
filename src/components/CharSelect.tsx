import * as React from 'react';
import {Character, CHARACTER_LIST} from './characters/charlist';
import Select from 'react-select';
import './CharSelect.css';

export const CHARACTERS = Object.keys(CHARACTER_LIST);

export interface CharSelectProps {
	value?: Character | null;
}

interface CharSelectState {}

const formatOptionLabel = (data: Character | null) => {
	if (data) {
		const image = require(`${data.charAsset}`);
		return (
			<>
				<div className='selectContainer'>
					<span className='item-container'>
						<img className='item-img' src={image} />
						<span className='item-txt'>{data.charName}</span>
					</span>
				</div>
			</>
		);
	}
};

export default class CharSelect extends React.Component<CharSelectProps, CharSelectState> {
	constructor(props: CharSelectProps) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<>
				<Select
					defaultValue={CHARACTER_LIST['SOL']}
					options={Object.keys(CHARACTER_LIST).map((x) => CHARACTER_LIST[x])}
					value={this.props.value}
					formatOptionLabel={formatOptionLabel}
					styles={{menuList: (base) => ({...base, backgroundColor: '#FFFFFF'})}}
					closeMenuOnSelect={false}
					menuIsOpen={true}
				/>
			</>
		);
	}
}
