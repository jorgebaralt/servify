import React, { Component } from 'react';
import { ScrollView, Text, View, Slider, Keyboard } from 'react-native';
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
		radius: 1609.34
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
					latitudeDelta: prevState.latitudeDelta,
					longitudeDelta: prevState.longitudeDelta
				},
				center: {
					latitude: coords.latitude,
					longitude: coords.longitude
				}
			}));	
		} else {
			// update map to new location
			const newAddress = await getLocationFromAddress(text);
			if (newAddress.longitude && newAddress.latitude) {
				this.setState((prevState) => ({
					region: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude,
						latitudeDelta: prevState.latitudeDelta,
						longitudeDelta: prevState.longitudeDelta
					},
					center: {
						latitude: newAddress.latitude,
						longitude: newAddress.longitude
					}
				}));
			}
		}
	}

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
				<Text style={globalStyles.stepStyle}>Step 3</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					Enter your address
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>
					This is to let customers know where you provide the service.
				</Text>

				<FloatingLabelInput
					value={props.state.location}
					label="Address, Zip Code, or Location"
					firstColor={colors.darkGray}
					secondColor={colors.secondaryColor}
					fontColor={colors.black}
					onChangeText={(text) => this.onLocationChange(text)}
					style={{ marginTop: 30 }}
				/>

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
					onValueChange={async (value) => this.onMilesChange(value)}
					// value={props.state.miles}
					step={1}
					minimumValue={1}
					maximumValue={60}
					minimumTrackTintColor={colors.secondaryColor}
					thumbTintColor={colors.secondaryColor}
				/>
				<View pointerEvents="none">
					<MapView
						style={{
							height: 200,
							width: '100%',
							marginTop: 20,
							borderRadius: 8
						}}
						region={this.state.region}
					>
						<MapView.Circle
							center={this.state.center}
							radius={this.state.radius}
							strokeColor="#FF7043"
						/>
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
						onPress={props.onBack()}
						textColor={colors.primaryColor}
					>
						<Text>Back</Text>
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={() => this.onNext()}
						style={{ width: '40%' }}
						disabled={this.props.state.location === ''}
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
