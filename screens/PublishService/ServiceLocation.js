import React, { Component } from 'react';
import { ScrollView, Text, View, Slider, Keyboard, Switch } from 'react-native';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import { Button, FloatingLabelInput } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { getLocationFromAddress } from '../../api';

class ServiceLocation extends Component {
	state = {
		region: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.7284139050434533,
			longitudeDelta: 1.5484332778314212
		},
		center: {
			latitude: 37.78825,
			longitude: -122.4324
		},
		radius: 1609.34,
	};

	componentDidMount() {
		if (this.props.userLocation) {
			const { coords } = this.props.userLocation;
			const region = {
				latitude: coords.latitude,
				longitude: coords.longitude,
				latitudeDelta: 0.03215,
				longitudeDelta: 0.0683
			};
			const center = {
				latitude: coords.latitude,
				longitude: coords.longitude
			};
			this.setState({ region, center });
		}
	}

	onNext = () => {
		// make sure there are no miles, if the user do not deliver
		if (!this.props.state.hasDelivery) {
			this.props.milesChange(null);
		}
		this.props.onNext();
		Keyboard.dismiss();
	};

	updateLocation = async (text) => {
		// if empty the text box, go to current location
		if (text.length < 2) {
			const { coords } = this.props.userLocation;
			this.setState((prevState) => ({
				region: {
					latitude: coords.latitude,
					longitude: coords.longitude,
					latitudeDelta: prevState.region.latitudeDelta,
					longitudeDelta: prevState.region.longitudeDelta
				},
				center: {
					latitude: coords.latitude,
					longitude: coords.longitude
				}
			}));
		} else {
			// update map to new location
			const newAddress = await getLocationFromAddress(text);
			if (newAddress) {
				this.setState((prevState) => ({
					region: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude,
						latitudeDelta: prevState.region.latitudeDelta,
						longitudeDelta: prevState.region.longitudeDelta
					},
					center: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude
					}
				}));
			}
		}
	};

	onLocationChange = async (text) => {
		this.props.locationChange(text);
		this.updateLocation(text);
	};

	// update map with miles
	onMilesChange = (value) => {
		this.props.milesChange(value);
		this.setState((prevState) => ({
			radius: value * 1609.34,
			region: {
				latitude: prevState.region.latitude,
				longitude: prevState.region.longitude,
				latitudeDelta: 0.03215 * value,
				longitudeDelta: 0.0683 * value
			}
		}));
	};

	render() {
		const { ...props } = this.props;
		return (
			<ScrollView
				style={{
					width: props.width,
					paddingLeft: 20,
					paddingRight: 20
				}}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={globalStyles.stepStyle}>Step 4</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					Enter your address
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>
					This is to let customers know the are where you provide the
					service, you can simply write a state, zipcode or specific
					address
				</Text>

				<FloatingLabelInput
					value={props.state.location}
					label={
						props.state.hasPhysicalLocation
							? 'Enter your exact location'
							: 'Address, Location, or Zipcode'
					}
					firstColor={colors.darkGray}
					secondColor={colors.secondaryColor}
					fontColor={colors.black}
					onChangeText={(text) => this.onLocationChange(text)}
					style={{ marginTop: 30 }}
				/>
				{/* Only diplay if has physical location */}
				{props.state.hasPhysicalLocation ? (
					<View>
						<Text style={{ marginTop: 2, fontSize: 10 }}>
							Enter street number, street, city and zip code
						</Text>
					</View>
				) : null}

				{/* Display miles slider if the service can be delivered */}
				{props.state.hasDelivery ? (
					<View>
						<Text
							style={[
								globalStyles.sectionTitle,
								{ marginTop: 20, fontWeight: '300' }
							]}
						>
							Distance:{' '}
							<Text style={{ fontWeight: '400' }}>
								{props.state.miles} miles
							</Text>
						</Text>

						<Slider
							onValueChange={async (value) => this.onMilesChange(value)
							}
							step={1}
							minimumValue={1}
							maximumValue={60}
							minimumTrackTintColor={colors.secondaryColor}
							thumbTintColor={colors.secondaryColor}
						/>
					</View>
				) : null}

				<View pointerEvents="none">
					<MapView
						style={{
							height: 200,
							width: '100%',
							marginTop: 20,
							borderRadius: 8
						}}
						initialRegion={this.state.region}
						region={this.state.region}
					>
						{props.state.hasDelivery ? (
							<MapView.Circle
								center={this.state.center}
								radius={this.state.radius}
								strokeColor="#FF7043"
							/>
						) : null}
						{props.state.hasPhysicalLocation ? (
							<MapView.Marker coordinate={this.state.center} />
						) : null}
					</MapView>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 40,
						marginBottom: 40
					}}
				>
					<Button
						bordered
						color={colors.primaryColor}
						onPress={() => props.onBack()}
						textColor={colors.primaryColor}
					>
						<Text>Back</Text>
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={() => this.onNext()}
						style={{ width: '40%' }}
						disabled={props.state.location === '' || (props.state.hasDelivery && props.state.miles === null)}
					>
						<Text>Next</Text>
					</Button>
				</View>
			</ScrollView>
		);
	}
}

function mapStateToProps(state) {
	return {
		userLocation: state.location.data
	};
}

export default connect(mapStateToProps)(ServiceLocation);
