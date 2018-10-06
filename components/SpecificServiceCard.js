import React, { Component } from 'react';
import {
	View,
	Platform,
	TouchableOpacity,
	LayoutAnimation
} from 'react-native';
import { Text, Card, CardItem, Button, Icon } from 'native-base';
import { connect } from 'react-redux';

class SpecificServiceCard extends Component {
	componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

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
						<Text style={[displayNameStyle, { marginTop: 10 }]}>
							{service.displayName}
						</Text>
						<Text style={displayNameStyle}>{service.phone}</Text>
						<Text style={displayNameStyle}>{service.location.city}</Text>
						<Text style={displayNameStyle}>zip code: {service.zipCode}</Text>
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
		marginLeft: 20,
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
