import React, { Component } from 'react';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { Text, Card, CardItem, Button, Icon } from 'native-base';
import { connect } from 'react-redux';

class SpecificServiceCard extends Component {
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
						<Text style={[displayNameStyle, { marginTop: 3 }]}>
							{service.rating}{' '}
						</Text>
						<AirbnbRating
							count={5}
							defaultRating={service.ratingSum / service.ratingCount}
							size={15}
						/>
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
		const {
			cardStyle,
			cardHeaderStyle,
			titleStyleCard,
			displayNameStyle
		} = styles;
		return (
			<TouchableOpacity
				style={{ marginBottom: 10 }}
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
		width: 140,
		height: 140,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		marginRight: 20,
		marginTop: 20
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
		alignItems: 'flex-start'
	},
	displayNameStyle: {
		fontSize: 13,
		fontWeight: undefined
	}
};

export default connect(null)(SpecificServiceCard);
