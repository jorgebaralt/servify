import React, { Component } from 'react';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { Text, Card, CardItem } from 'native-base';
import { connect } from 'react-redux';
import StarsRating from '../Ratings/StarsRating';

class SpecificServiceCard extends Component {
	// animate on appear
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	renderContent = () => {
		const { service } = this.props;
		const { displayNameStyle } = styles;

		if (this.props.showRating) {
			return (
				<View>
					<View style={{ flexDirection: 'row' }}>
						<Text style={displayNameStyle}>
							{service.rating.toFixed(1)}{' '}
						</Text>
						<StarsRating rating={service.rating} />
					</View>
					<Text style={[displayNameStyle, { marginTop: 10 }]}>
						{service.displayName}
					</Text>
					<Text style={displayNameStyle}>{service.phone}</Text>
				</View>
			);
		}
		return (
			<View>
				<Text style={[displayNameStyle, { marginTop: 10 }]}>
					{service.displayName}
				</Text>
				<Text style={displayNameStyle}>{service.phone}</Text>
				<Text style={displayNameStyle}>{service.location.city}</Text>
				<Text style={displayNameStyle}>zip code: {service.zipCode}</Text>
			</View>
		);
	};

	render() {
		const { service } = this.props;
		const { cardStyle, cardHeaderStyle, titleStyleCard } = styles;
		return (
			<TouchableOpacity
				style={{ marginBottom: 10, borderRadius: 8 }}
				onPress={() => {
					this.props.onPress();
				}}
			>
				<Card style={cardStyle}>
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
		width: 150,
		height: 150,
		shadowOffset: { width: 1, height: 1 },
		shadowColor: 'black',
		shadowOpacity: 0.5,
		elevation: 1,
		marginLeft: 20,
		marginTop: 20,
		borderRadius: 8
	},
	titleStyleCard: {
		fontSize: 15,
		height: 38
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

export default connect(null)(SpecificServiceCard);
