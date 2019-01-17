import React, { Component } from 'react';
import { TouchableOpacity, LayoutAnimation, View, Text } from 'react-native';
import { LinearGradient } from 'expo';

class CategoryCard extends Component {
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}
	
	render() {
		const { category, cardStyle } = this.props;
		const { color } = category;

		return (
			<TouchableOpacity onPress={() => this.props.onPress()}>
				<View style={[cardStyle, { marginRight: this.props.last ? 20 : 0 }]}>
					{/* TODO: grab specific color from each category, ADD: An array of [x, y] where x and y are floats */}
					<LinearGradient
						colors={color}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{ flex: 1 }}
					>
						<View header style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Text style={{ color: 'white', fontSize: 16, alignItems: 'center' }}>
								{category.title}
							</Text>
						</View>	
					</LinearGradient>
				</View>
			</TouchableOpacity>
		);
	}
}

export { CategoryCard };