import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	LayoutAnimation,
	Text,
	Dimensions
} from 'react-native';
import StarsRating from '../../Ratings/StarsRating';
import { FadeImage } from '..';
import { colors } from '../../../shared/styles';

const WIDTH = Dimensions.get('window').width;

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
		const { cardStyle, cardContentStyle, titleStyleCard } = styles;
		return (
			<TouchableOpacity
				style={[cardStyle, { marginRight: this.props.last ? 20 : 0 }]}
				onPress={() => {
					this.props.onPress();
				}}
			>
				<View>
					<FadeImage
						uri={this.props.uri}
						image={this.props.image}
						style={{ height: 100 }}
					/>
					<View style={cardContentStyle}>
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
		width: (WIDTH - 15) * 0.4,
		marginLeft: 20,
		marginTop: 20,
		borderRadius: 8,
		overflow: 'hidden',
		marginBottom: 10,
		borderWidth: 0.5,
		borderColor: colors.lightGray
	},
	titleStyleCard: {
		fontSize: 11,
		fontWeight: '600'
	},
	headerTitleStyle: {
		color: 'white'
	},
	cardContentStyle: {
		flexDirection: 'column',
		display: 'flex',
		alignItems: 'flex-start',
		overflow: 'hidden',
		borderTopWidth: 0.5,
		padding: 5,
		borderColor: colors.lightGray
	},
	displayNameStyle: {
		fontSize: 12,
		fontWeight: undefined
	}
};

export { HomeServiceCard };
