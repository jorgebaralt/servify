import React, { Component } from 'react';
import { View, ListView, TouchableOpacity, Dimensions } from 'react-native';
import {
	Header,
	Text,
	Card,
	CardItem,
	Body,
	Title,
	Container,
	Left,
	Button,
	Icon,
	Right,
	Spinner
} from 'native-base';
import { connect } from 'react-redux';
import { getServicesByEmail, selectService } from '../actions';
import EmptyListMessage from '../components/EmptyListMessage';

let item;
let errorMessage;
let willFocusSubscription;

class ProfileServicesScreen extends Component {
	state = {
		dataLoaded: false,
		loading: false
	};

	async componentWillMount() {
		let data;
		item = this.props.navigation.getParam('item');
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			async () => {
				if (item.id === 'favorites') {
					const newdata = this.props.favorites;
					if (newdata !== data) {
						this.setState({ dataLoaded: false, loading: true });
						this.dataSource = ds.cloneWithRows(newdata);
						if (this.dataSource) {
							this.setState({ dataLoaded: true, loading: false });
						}
					}
				}
			}
		);

		if (item.id === 'favorites') {
			data = this.props.favorites;
			errorMessage =	'There is nothing in this list, Make sure that you add Services to Favorite by cliking on the top right icon, when looking at services.';
		} else if (item.id === 'my_services') {
			await this.props.getServicesByEmail(this.props.email);
			data = this.props.servicesList;
			errorMessage =	'There is nothing in this list, Make sure that you create a Service from our Post screen, then you will be able to modify it here';
		}
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.dataSource = ds.cloneWithRows(data);
		if (this.dataSource) {
			this.setState({ dataLoaded: true, loading: false });
		}
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	onBackPress = async () => {
		await this.props.navigation.goBack();
	};

	renderServices = (service) => {
		if (service) {
			const {
				cardStyle,
				titleStyle,
				phoneLocationStyle,
				displayNameStyle,
				cardHeaderStyle,
				cardItemStyle
			} = styles;
			const displayDescription = service.description.substring(0, 30) + '...';
			return (
				<TouchableOpacity
					key={service.id}
					onPress={() => {
						this.props.selectService(service);
						this.props.navigation.navigate('service');
					}}
				>
					<Card style={cardStyle}>
						<CardItem header style={cardHeaderStyle}>
							<Text style={titleStyle}>{service.title}</Text>
							<Text style={displayNameStyle}>by: {service.displayName}</Text>
						</CardItem>
						<CardItem style={cardItemStyle}>
							<Body style={phoneLocationStyle}>
								<Text>{service.phone}</Text>
								<Text style={{ marginLeft: '15%' }}>{service.location.city}</Text>
							</Body>
							<Right>
								<Icon name="arrow-forward" style={{ color: '#FF7043' }} />
							</Right>
						</CardItem>
						<CardItem style={cardItemStyle}>
							<Body>
								<Text>{displayDescription}</Text>
							</Body>
						</CardItem>
					</Card>
				</TouchableOpacity>
			);
		}
		return (
			<EmptyListMessage buttonPress={this.onBackPress}>
				{errorMessage}
			</EmptyListMessage>
		);
	};

	renderSpinner() {
		if (this.state.loading) {
			return <Spinner color="orange" />;
		}
		return <View />;
	}

	renderListView = () => {
		if (this.state.loading) {
			return this.renderSpinner();
		}
		if (this.state.dataLoaded) {
			if (this.dataSource._cachedRowCount > 0) {
				return (
					<ListView
						style={{ marginTop: 10 }}
						dataSource={this.dataSource}
						renderRow={(service) => this.renderServices(service)}
						enableEmptySections
					/>
				);
			}
			return (
				<EmptyListMessage buttonPress={this.onBackPress}>
					{errorMessage}
				</EmptyListMessage>
			);
		}
		return <Spinner color="#FF7043" />;
	};

	render() {
		return (
			<Container>
				<Header>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'black' }} />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title> {item.title} </Title>
					</Body>
					<Right />
				</Header>
				{this.renderListView()}
			</Container>
		);
	}
}

const styles = {
	headerStyle: {},
	cardStyle: {
		width: '80%',
		marginLeft: '10%',
		marginTop: '2.5%'
	},
	contentStyle: {},
	titleStyle: {
		fontSize: 18
	},
	phoneLocationStyle: {
		flexDirection: 'row',
		flex: 1
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
		fontSize: 14,
		fontWeight: undefined
	},
	cardItemStyle: {
		marginTop: -10
	}
};

function mapStateToProps(state) {
	return {
		favorites: state.favoriteServices,
		servicesList: state.serviceResult.servicesList,
		email: state.auth.email
	};
}

export default connect(
	mapStateToProps,
	{ getServicesByEmail, selectService }
)(ProfileServicesScreen);
