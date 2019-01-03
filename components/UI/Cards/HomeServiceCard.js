import React, { Component } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Text } from 'react-native';
import StarsRating from '../../Ratings/StarsRating';
import { FadeImage } from '..';
import { colors } from '../../../shared/styles';

class HomeServiceCard extends Component {
	// animate on appear
	async componentWillMount() {
		LayoutAnimation.easeInEaseOut();
	}

	renderContent = () => {
		const { service } = this.props;
		const { displayNameStyle } = styles;

		return (
			<View style={{ marginTop: 5}}>
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
				style={[cardStyle,{ marginBottom: 10, borderRadius: 8, marginRight: this.props.last ? 20 : 0 }]}
				onPress={() => {
					this.props.onPress();
				}}
			>
				<View>
					<FadeImage image={this.props.image} style={{ height: 100 }} />
					<View style={[cardHeaderStyle, {borderWidth: 0.5, borderBottomStartRadius: 8, borderBottomEndRadius: 8, borderTopWidth: 0, padding: 5, borderColor: colors.lightGray }]}>
						<Text style={titleStyleCard}>{service.title}</Text>
						{this.renderContent()}
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}
const styles = {
	cardStyle: {
		width: 170,
		height: 175,
		marginLeft: 20,
		marginTop: 20,
		borderRadius: 8,
		overflow: 'hidden'
	},
	titleStyleCard: {
		fontSize: 12,
		fontWeight: '600'
	},
	headerTitleStyle: {
		color: 'white'
	},
	cardHeaderStyle: {
		flexDirection: 'column',
		display: 'flex',
		alignItems: 'flex-start',
		overflow: 'hidden',
	},
	displayNameStyle: {
		fontSize: 12,
		fontWeight: undefined
	}
};

export { HomeServiceCard };
