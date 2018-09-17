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
import { LinearGradient } from 'expo';
import {
	getServicesCategory,
	getServicesSubcategory,
	selectService
} from '../actions';
import EmptyListMessage from '../components/EmptyListMessage';

const SCREEN_WIDTH = Dimensions.get('window').width;
class ServicesList extends Component {
	state = { dataLoaded: false };

	componentWillMount = async () => {
		const { category, subcategory } = this.props;
		const categoryRef = category.dbReference;

		if (subcategory) {
			const subcategoryRef = subcategory.dbReference;
			await this.props.getServicesSubcategory(categoryRef, subcategoryRef);
		} else {
			await this.props.getServicesCategory(categoryRef);
		}

		const { servicesList } = this.props;
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.dataSource = ds.cloneWithRows(servicesList);
		if (this.dataSource) {
			this.setState({ dataLoaded: true });
		}
	};

	onBackPress = () => {
		this.props.navigation.goBack(null);
	};

	renderServices = (service) => {
        const { grayStyle, cardStyle, titleStyle, phoneLocationStyle, displayNameStyle, cardHeaderStyle, cardItemStyle } = styles;
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
							<Text style={grayStyle}>{service.phone}</Text>
							<Text style={[grayStyle, { marginLeft: '15%' }]}>
								{service.location.city}
							</Text>
						</Body>
						<Right>
							<Icon
								name="arrow-forward"
								style={{ color: this.props.category.color[0] }}
							/>
						</Right>
					</CardItem>
					<CardItem style={cardItemStyle}>
						<Body>
							<Text style={grayStyle}>{displayDescription}</Text>
						</Body>
					</CardItem>
				</Card>
			</TouchableOpacity>
		);
	};

	renderListView() {
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
					Unfortunetly there are no services posted for this category, we are
					working on getting more people to Post Services!
				</EmptyListMessage>
			);
		}
		return <Spinner color={this.props.category.color[0]} />;
	}

	render() {
		const { headerTitleStyle } = styles;
		const { subcategory, category } = this.props;
		return (
			<Container>
				<Header style={{ backgroundColor: category.color[0] }}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.onBackPress();
							}}
						>
							<Icon name="arrow-back" style={{ color: 'white' }} />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={headerTitleStyle}>
							{subcategory ? subcategory.title : category.title}
						</Title>
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
    grayStyle: {
        color: 'gray'
    },
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

const mapStateToProps = (state) => ({
	subcategory: state.selectedCategory.subcategory,
	category: state.selectedCategory.category,
	servicesList: state.getServiceResult.servicesList
});

export default connect(
	mapStateToProps,
	{ getServicesCategory, getServicesSubcategory, selectService }
)(ServicesList);
