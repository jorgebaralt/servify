import React, { Component } from 'react';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import StarsRating from '../../Ratings/StarsRating';
import { FadeImage } from '..';

class HomeServiceCard extends Component {
	// animate on appear
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	renderContent = () => {
		const { service } = this.props;
		const { displayNameStyle } = styles;

		return (
			<View style={{ marginTop: 5 }}>
				<Text style={displayNameStyle}>
					{service.displayName}
				</Text>
				{/* Show rating */}
				{this.props.showRating ? (
					<View style={{ flexDirection: 'row' }}>
						<Text style={displayNameStyle}>
							{service.rating.toFixed(1)}{' '}
						</Text>
						<StarsRating rating={service.rating} />
					</View>
				) : (
					<View />
					)}
				{/* Show location */}
				{this.props.showLocation ? (
					<Text style={displayNameStyle}>
						{service.locationData.city}
					</Text>
				) : (
					<View />
					)}
				{/* TODO: Show price */}
			</View>
		);
	};

	render() {
		const { service } = this.props;
		const { cardStyle, cardHeaderStyle, titleStyleCard } = styles;
		return (
			<TouchableOpacity
				style={{ marginBottom: 10, borderRadius: 8, marginRight: this.props.last ? 20 : 0 }}
				onPress={() => {
					this.props.onPress();
				}}
			>
				<Card style={cardStyle}>
					<FadeImage image={require('../../../assets/default/food/1.jpg')} style={{ height: 100 }} />
					<CardItem header style={cardHeaderStyle}>
						<Text style={titleStyleCard}>{service.title}</Text>
						{this.renderContent()}
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	}
}
const styles = {
	cardStyle: {
		width: 170,
		height: 175,
		shadowOffset: { width: 1, height: 1 },
		shadowColor: 'black',
		shadowOpacity: 0.5,
		elevation: 1,
		marginLeft: 20,
		marginTop: 20,
		borderRadius: 8,
		overflow: 'hidden'
	},
	titleStyleCard: {
		fontSize: 12
	},
	headerTitleStyle: {
		color: 'white'
	},
	cardHeaderStyle: {
		flexDirection: 'column',
		display: 'flex',
		alignItems: 'flex-start',
		borderRadius: 8
	},
	displayNameStyle: {
		fontSize: 12,
		fontWeight: undefined
	}
};

export { HomeServiceCard };
