import React, { Component } from 'react';
import { TouchableOpacity, ListView, DeviceEventEmitter, FlatList } from 'react-native';
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
	Right
} from 'native-base';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { deselectCategory, selectSubcategory } from '../actions';

let willFocusSubscription;
let backPressSubscriptions;

class SubcategoriesListScreen extends Component {

	componentWillMount() {
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
        backPressSubscriptions.add(() => this.props.navigation.pop());
    };


	onBackPressed = () => {
		this.props.deselectCategory();
		this.props.navigation.goBack('browse');
	};

	doSelectSubcategory = async (subcategory) => {
		await this.props.selectSubcategory(subcategory);
		await this.props.navigation.navigate('servicesList');
	};

	renderSubcategories = (subcategory) => (
		<TouchableOpacity
			key={subcategory.id}
			onPress={() => this.doSelectSubcategory(subcategory)}
		>
			<Card style={styles.cardStyle}>
				<CardItem header>
					<Text>{subcategory.title}</Text>
					<Right>
						<Icon
							name="arrow-forward"
							style={{ color: this.props.category.color[0] }}
						/>
					</Right>
				</CardItem>
				<CardItem>
					<Body>
						<Text>{subcategory.description}</Text>
					</Body>
				</CardItem>
			</Card>
		</TouchableOpacity>
	);

	render() {
		return (
			<Container>
				<Header style={{ backgroundColor: this.props.category.color[0] }}>
					<Left>
						<Button
							transparent
							onPress={() => {
								this.props.navigation.navigate('browse');
							}}
						>
							<Icon name="arrow-back" style={{ color: 'white' }} />
						</Button>
					</Left>
					<Body style={{ flex: 3 }}>
						<Title style={{ color: 'white' }}>
							{this.props.category.title}
						</Title>
					</Body>
					<Right />
				</Header>

				<FlatList
					data={this.props.category.subcategories}
					renderItem={({ item }) => this.renderSubcategories(item)}
					keyExtractor={(item) => item.title}
				/>
			</Container>
		);
	}
}

const styles = {
	cardStyle: {
		width: '80%',
		marginLeft: '10%',
		marginTop: '2.5%'
	},
	contentStyle: {}
};
const mapStateToProps = (state) => ({
	category: state.selectedCategory.category
});
export default connect(
	mapStateToProps,
	{ deselectCategory, selectSubcategory }
)(SubcategoriesListScreen);
