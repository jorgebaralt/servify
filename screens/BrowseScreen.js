import React, { Component } from 'react';
import {
	View,
	SafeAreaView,
	Dimensions,
	TouchableOpacity,
	ListView,
	DeviceEventEmitter,
	Platform
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
import { selectCategory } from '../actions';

let willFocusSubscription;
let backPressSubscriptions;

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
		dataSource: undefined
	};

	async componentWillMount() {
		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.setState({ dataSource: ds.cloneWithRows(this.props.categories) });

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

	renderCategories(category) {
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
	}

	render() {
		const { titleStyle, androidHeader, iosHeader } = styles;
		return (
			<Container style={{ flex: 1 }}>
				<Header
					searchBar
					rounded
					style={Platform.OS === 'android' ? androidHeader : iosHeader}
				>
					<Item>
						<Icon name="ios-search" />
						<Input placeholder="Where you need help?" />
					</Item>
					<Button transparent>
						<Text>Search</Text>
					</Button>
				</Header>
				<Content>
					<ListView
						contentContainerStyle={styles.contentStyle}
						dataSource={this.state.dataSource}
						renderRow={(category) => this.renderCategories(category)}
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
	contentStyle: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		flex: 1
	},
	cardStyle: {
		height: 100
	},
	gridItem: {
		marginLeft: 10,
		marginTop: 10,
		width: SCREEN_WIDTH / 2 - 15
	}
};

function mapStateToProps(state) {
	return { categories: state.categories };
}

export default connect(
	mapStateToProps,
	{ selectCategory }
)(BrowseScreen);
