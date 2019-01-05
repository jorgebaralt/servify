import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	LayoutAnimation,
	Text,
	Dimensions,
	Alert
} from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import StarsRating from '../../Ratings/StarsRating';
import { FadeImage } from '..';
import { colors } from '../../../shared/styles';

const HEIGHT = Dimensions.get('window').height;

class ProfileServiceCard extends Component {
	state = { favoriteIcon: 'favorite' }
	
	componentWillUpdate() {
		LayoutAnimation.easeInEaseOut();
	}

	favAlert = () => {
		this.setState({ favoriteIcon: 'favorite-border' });
		const { service } = this.props;
		Alert.alert('Remove Favorite', `Do you want to remove "${service.title}" from favorite?`, [
			{
				text: 'Remove',
				style: 'destructive',
				onPress: this.props.onRemoveFavorite
			},
			{
				text: 'Cancel',
				style: 'cancel',
				onPress: () => this.setState({ favoriteIcon: 'favorite' })
			}
		]);
	};

	editAlert = () => {
		const { service } = this.props;
		Alert.alert('Edit Service', `Do you want to edit "${service.title}" ?`, [
			{
				text: 'Edit',
				style: 'cancel',
				onPress: this.props.onEditService
			},
			{
				text: 'Cancel',
				style: 'default'
			}
		]);
	}

	render() {
		const { service, ...props } = this.props;
		return (
			<TouchableOpacity
				style={{ marginTop: 20,marginBottom: 20, overflow: 'hidden' }}
				onPress={props.onPress}
			>
				<FadeImage
					image={this.props.image}
					style={{ height: (HEIGHT - 120) * 0.25, borderRadius: 5 }}
				/>
				<View
					style={{
						marginTop: 5,
						flexDirection: 'row',
						justifyContent: 'space-between'
					}}
				>
					<Text
						style={{
							color: colors.black,
							fontWeight: '500',
							fontSize: 18
						}}
					>
						{service.title}
					</Text>
					{/* Render Icon */}
					{props.type === 'favorites' ? (
						<MaterialIcons
							onPress={() => this.favAlert()}
							name={this.state.favoriteIcon}
							size={24}
							style={{ color: colors.danger }}
						/>
					) : (
						<Entypo
							onPress={() => this.editAlert()}
							name="dots-three-horizontal"
							size={24}
							style={{ color: colors.black }}
						/>
					)}
				</View>
				<View style={{ flexDirection: 'row' }}>
					<StarsRating
						rating={service.rating}
						style={{ marginTop: 1, color: colors.secondaryColor }}
					/>
					<Text style={{ fontSize: 12 }}>
						{service.rating.toFixed(1)} - {service.displayName}{' '}
					</Text>
				</View>
				<View>
					<Text
						style={{ fontSize: 12, color: colors.secondaryColor }}
					>
						{service.locationData.city},{' '}
						{service.locationData.region}
					</Text>
				</View>
				<View
					style={{
						backgroundColor: colors.lightGray,
						height: 1,
						marginTop: 10
					}}
				/>
			</TouchableOpacity>
		);
	}
}

export { ProfileServiceCard };
