import React, { Component } from 'react';
import { TouchableOpacity, LayoutAnimation, Dimensions } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';

const SCREEN_WIDTH = Dimensions.get('window').width;

class CategoryCard extends Component {
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	render() {
		const { category } = this.props;
		const { color } = category;

		return (
			<TouchableOpacity
				style={styles.gridItem}
				onPress={() => this.props.onPress()}
			>
				<Card style={styles.cardStyle}>
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

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {},
	titleStyle: {
		textAlign: 'center',
		color: 'black',
		fontWeight: 'bold',
		fontSize: 26,
		margin: 20
	},
	cardStyle: {
		height: 100
	},
	gridItem: {
		marginLeft: 10,
		marginTop: 5,
		width: SCREEN_WIDTH / 2 - 15,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1
	}
};

export default connect(null)(CategoryCard);
