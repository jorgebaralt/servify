import React, { Component } from 'react';
import { TouchableOpacity, DeviceEventEmitter, FlatList } from 'react-native';
import {
	Text,
	Card,
	CardItem,
	Header,
	Body,
	Title,
	Container,
	Left,
	Button,
	Icon,
	Right,
	Content
} from 'native-base';
import { pageHit } from '../../shared/ga_helper';

let willFocusSubscription;
let backPressSubscriptions;

class SubcategoriesListScreen extends Component {
	state = { category: null };
	
	async componentWillMount() {
		await this.setState({
			category: this.props.navigation.getParam('category'),
		});
		willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			this.handleAndroidBack
		);
	}

	componentDidMount() {
		pageHit('Subcategories List Screen');
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
		backPressSubscriptions.add(() => this.props.navigation.pop());
	};

	onBackPressed = () => {
		this.props.navigation.goBack('browse');
	};

	doSelectSubcategory = async (subcategory) => {
		await this.props.navigation.navigate('servicesList', { subcategory, category: this.state.category });
	};

	renderSubcategories = (subcategory) => (
		<TouchableOpacity
			key={subcategory.id}
			onPress={() => this.doSelectSubcategory(subcategory)}
		>
			<Card style={styles.cardStyle}>
				<CardItem header style={{ borderRadius: 8 }}>
					<Text>{subcategory.title}</Text>
					<Right>
						<Icon
							name="ios-arrow-forward"
							type="Ionicons"
							style={{ color: this.state.category.color[0] }}
						/>
					</Right>
				</CardItem>
				<CardItem>
					<Body style={{ marginBottom: -15 }}>
						<Text>{subcategory.description}</Text>
					</Body>
				</CardItem>
			</Card>
		</TouchableOpacity>
	);

	render() {
		return (
			<Container>
				<Header style={{ backgroundColor: this.state.category.color[0] }}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.props.navigation.navigate('browse');
							}}
						>
							<Icon
								name="ios-arrow-back"
								type="Ionicons"
								style={{ color: 'white' }}
							/>
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'white' }}>
							{this.state.category.title}
						</Title>
					</Body>
					<Right />
				</Header>
				<Content>
					<FlatList
						data={this.state.category.subcategories}
						renderItem={({ item }) => this.renderSubcategories(item)}
						keyExtractor={(item) => item.title}
					/>
				</Content>
			</Container>
		);
	}
}

const styles = {
	cardStyle: {
		width: '80%',
		marginLeft: '10%',
		marginTop: '2.5%',
		shadowOffset: { width: 0, height: 0 },
		shadowColor: 'black',
		shadowOpacity: 0.2,
		elevation: 1,
		height: 100,
		borderRadius: 8
	},
	contentStyle: {}
};

export default SubcategoriesListScreen;
