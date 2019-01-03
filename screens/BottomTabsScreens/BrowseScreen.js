import React, { Component } from 'react';
import {
	Dimensions,
	DeviceEventEmitter,
	FlatList,
	Keyboard,
	SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CategoryCard, SearchHeader } from '../../components/UI';
import { pageHit } from '../../shared/ga_helper';
import categories from '../../shared/categories';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let willBlurSubscription;
let backPressSubscriptions;
let keyboardDidHideListener;
const SCREEN_WIDTH = Dimensions.get('window').width;
class BrowseScreen extends Component {
	static navigationOptions = {
		title: 'Browse',
		tabBarIcon: ({ tintColor }) => (
			<MaterialCommunityIcons
				name="magnify"
				size={32}
				style={{ color: tintColor }}
			/>
		)
	};

	state = {
		filter: '',
		categories
	};

	async componentWillMount() {
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			() => {
				this.handleAndroidBack();
				this.handleSearch();
			}
		);
		willBlurSubscription = this.props.navigation.addListener(
			'willBlur',
			() => {
				// clean state and handle search to restore filter
				this.setState({ filter: '' });
				this.handleSearch();
				// Scroll to top on blur
				this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
			}
		);
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
		// pick where to navigate
		if (category.subcategories) {
			this.props.navigation.navigate('subcategories', { category });
		} else {
			this.props.navigation.navigate('servicesList', { category });
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
		let inputArray = [this.state.filter];
		if (this.state.filter.includes(' ')) {
			inputArray = this.state.filter.split(' ');
		}
		categories.forEach((category) => {
			const found = inputArray.some((input) => category.keyWords.includes(input.toLowerCase()));
			if (found && !nameCheckCategory.includes(category.title)) {
				filteredCategories.push(category);
				nameCheckCategory.push(category.title);
			}
		});

		if (filteredCategories.length < 1 || this.state.filter.length < 1) {
			this.setState({ categories });
		} else {
			this.setState({ categories: filteredCategories });
		}
	};

	_keyboardDidHide() {
		if (this.state.filter.length === 0) {
			this.setState({ filter: '' });
			this.handleSearch();
		}
	}

	render() {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<SearchHeader
					placeholder="Where do you need help?"
					value={this.state.filter}
					onChangeText={async (text) => {
						await this.setState({
							filter: text
						});
						this.handleSearch();
					}}
					onCancel={() => {
							this.setState({ filter: '' });
							this.handleSearch();
						}
					}
				/>

				<FlatList
					data={this.state.categories}
					renderItem={({ item }) => this.renderCategories(item)}
					keyExtractor={(category) => category.title}
					numColumns={2}
					ref={(listRef) => {
						this.listRef = listRef;
					}}
					style={{ backgroundColor: colors.white }}
				/>
			</SafeAreaView>
		);
	}
}

const styles = {
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
		marginTop: 10,
		width: SCREEN_WIDTH / 2 - 15,
		overflow: 'hidden'
	}
};

export default BrowseScreen;
