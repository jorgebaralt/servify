import React, { Component } from 'react';
import { TouchableOpacity, LayoutAnimation } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';

class CategoryCard extends Component {
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	render() {
		const { category } = this.props;
		const { color } = category;
		const { style } = this.props;

		return (
			<TouchableOpacity
				style={style}
				onPress={() => this.props.onPress()}
			>
				<Card style={this.props.cardStyle}>
					{/* TODO: grab specific color from each category, ADD: An array of [x, y] where x and y are floats */}
					<LinearGradient
						colors={color}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{ flex: 1 }}
					>
						<CardItem header style={{ backgroundColor: 'transparent' }}>
							<Text style={{ color: 'white', fontSize: 17 }}>{category.title}</Text>
						</CardItem>
					</LinearGradient>
				</Card>
			</TouchableOpacity>
		);
	}
}

export default connect(null)(CategoryCard);
