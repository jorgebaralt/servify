import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Dimensions,
	TouchableOpacity,
	DeviceEventEmitter,
	Platform,
	FlatList,
} from 'react-native';
import {
	Text,
	Card,
	CardItem,
	Icon,
	Header,
	Item,
	Button,
	Input,
	Container,
	Content
} from 'native-base';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { selectCategory, filterCategories, filterEmpty } from '../actions';

let willFocusSubscription;
let backPressSubscriptions;
let allCategories;
const SCREEN_WIDTH = Dimensions.get('window').width;
class BrowseScreen extends Component {
	static navigationOptions = {
		title: 'Browse',
		tabBarIcon: ({ tintColor }) => (
			<Icon
				type="MaterialCommunityIcons"
				name="magnify"
				style={{ color: tintColor }}
			/>
		)
	};

	state = {
		filter: ''
	};

	async componentWillMount() {
		allCategories = this.props.categories;
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
	}

	handleAndroidBack = () => {
		backPressSubscriptions = new Set();
		DeviceEventEmitter.removeAllListeners('hardwareBackPress');
		DeviceEventEmitter.addListener('hardwareBackPress', () => {
			const subscriptions = [];

			backPressSubscriptions.forEach((sub) => subscriptions.push(sub));
			for (let i = 0; i < subscriptions.reverse().length; i += 1) {
				if (subscriptions[i]()) {
					break;
				}
			}
		});
		backPressSubscriptions.add(() => this.props.navigation.navigate('home'));
	};

	doSelectCategory = async (category) => {
		await this.props.selectCategory(category);
		// pick where to navigate
		if (category.subcategories) {
			this.props.navigation.navigate('subcategories');
		} else {
			this.props.navigation.navigate('servicesList');
		}
	};

	renderCategories = (category) => {
		const { color } = category;
		return (
			<TouchableOpacity
				style={styles.gridItem}
				onPress={() => this.doSelectCategory(category)}
			>
				<Card style={styles.cardStyle}>
					{/* TODO: grab specific color from each category, ADD: An array of [x, y] where x and y are floats */}
					<LinearGradient
						colors={color}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
						style={{ flex: 1 }}
					>
						<CardItem header style={{ backgroundColor: 'transparent' }}>
							<Text style={{ color: 'white' }}>{category.title}</Text>
						</CardItem>
					</LinearGradient>
				</Card>
			</TouchableOpacity>
		);
	};

	handleSearch = () => {
		const filterWords = this.state.filter.toLowerCase().split(' ');
		const filteredCategories = [];
		const categoriesFiltered = [];
		
		filterWords.forEach((word) => {
			allCategories.forEach((category) => {
				if (category.keyWords.includes(word)) {
					if (!categoriesFiltered.includes(category.title)) {
						filteredCategories.push(category);
						categoriesFiltered.push(category.title);
					}
				}
			});
		});
		if (filteredCategories.length < 1 || this.state.filter === '') {
			this.props.filterEmpty();
		} else {
			this.props.filterCategories(filteredCategories);
		}
	};

	render() {
		const { androidHeader, iosHeader } = styles;
		return (
			<Container style={{ flex: 1 }}>
				<Header
					searchBar
					rounded
					style={Platform.OS === 'android' ? androidHeader : iosHeader}
				>
					<Item>
						<Icon name="ios-search" />
						<Input
							placeholder="Where do you need help?"
							value={this.state.filter}
							onChangeText={(text) => {
								this.setState({
									filter: text
								});
								this.handleSearch();
							}}
						/>
					</Item>
					<Button transparent onPress={() => this.handleSearch()}>
						<Text>Search</Text>
					</Button>
				</Header>
				<Content>
					<FlatList
						data={this.props.categories}
						renderItem={({ item }) => this.renderCategories(item)}
						keyExtractor={(category) => category.title}
						numColumns={2}
					/>
				</Content>
			</Container>
		);
	}
}

const styles = {
	androidHeader: {
		backgroundColor: '#F5F5F5'
	},
	iosHeader: {
	},
	titleStyle: {
		textAlign: 'center',
		color: 'black',
		fontWeight: 'bold',
		fontSize: 26,
		margin: 20
	},
	cardStyle: {
		height: 100,
	},
	gridItem: {
		marginLeft: 10,
		marginTop: 5,
		width: SCREEN_WIDTH / 2 - 15,
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1
	}
};

function mapStateToProps(state) {
	return { categories: state.categories };
}

export default connect(
	mapStateToProps,
	{ selectCategory, filterCategories, filterEmpty }
)(BrowseScreen);
