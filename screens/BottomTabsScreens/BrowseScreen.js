import React, { Component } from 'react';
import {
	Dimensions,
	DeviceEventEmitter,
	Platform,
	FlatList,
	Keyboard
} from 'react-native';
import {
	Text,
	Icon,
	Header,
	Item,
	Button,
	Input,
	Container,
	Content
} from 'native-base';
import { connect } from 'react-redux';
import { selectCategory, filterCategories, filterEmpty } from '../../actions';
import CategoryCard from '../../components/CategoryCard';
import { pageHit } from '../../shared/ga_helper';

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;
let allCategories;
let keyboardDidHideListener;
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
			() => {
				this.handleAndroidBack();
				this.handleSearch();
			}
		);
		willBlurSubscription = this.props.navigation.addListener('willBlur', () => {
			this.setState({ filter: '' });
			this.handleSearch();
		});
		keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
	}

	componentDidMount() {
		pageHit('Browse Screen');
	}

	componentWillUnmount() {
		willFocusSubscription.remove();
		willBlurSubscription.remove();
		keyboardDidHideListener.remove();
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

	renderCategories = (category) => (
		<CategoryCard
			cardStyle={styles.cardStyle}
			category={category}
			onPress={() => this.doSelectCategory(category)}
		/>
	);

	handleSearch = () => {
		const filteredCategories = [];
		const nameCheckCategory = [];

		allCategories.forEach((category) => {
			category.keyWords.forEach((key) => {
				if (key.includes(this.state.filter.toLowerCase())) {
					if (!nameCheckCategory.includes(category.title)) {
						filteredCategories.push(category);
						nameCheckCategory.push(category.title);
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

	_keyboardDidHide() {
		if (this.state.filter.length === 0) {
			this.setState({ filter: '' });
			this.handleSearch();
		}
	}

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
						style={{ marginBottom: 10, marginTop: 10 }}
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
	iosHeader: {},
	titleStyle: {
		textAlign: 'center',
		color: 'black',
		fontWeight: 'bold',
		fontSize: 26,
		margin: 20
	},
	cardStyle: {
		height: 90,
		borderRadius: 8,
		marginLeft: 10,
		marginTop: 5,
		width: SCREEN_WIDTH / 2 - 15,
		overflow: 'hidden'
	}
};

function mapStateToProps(state) {
	return {
		categories: state.categories,
		userLocation: state.auth.location
	};
}

export default connect(
	mapStateToProps,
	{ selectCategory, filterCategories, filterEmpty }
)(BrowseScreen);
