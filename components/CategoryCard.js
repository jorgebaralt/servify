import React, { Component } from 'react';
import { TouchableOpacity, LayoutAnimation } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo';

class CategoryCard extends Component {
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	render() {
		const { category, style, cardStyle } = this.props;
		const { color } = category;

		return (
			<TouchableOpacity style={style} onPress={() => this.props.onPress()}>
				<Card style={cardStyle}>
					{/* TODO: grab specific color from each category, ADD: An array of [x, y] where x and y are floats */}
					<LinearGradient
						colors={color}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{ flex: 1, borderRadius: 8 }}
					>
						<CardItem header style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 17, alignItems: 'center' }}>
								{category.title}
							</Text>
						</CardItem>
					</LinearGradient>
				</Card>
			</TouchableOpacity>
		);
	}
}

export default CategoryCard;
