import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	FlatList,
	View,
	SafeAreaView,
	StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pageHit } from '../../shared/ga_helper';
import { CustomHeader, SubcategoryCard } from '../../components/UI';
import { colors } from '../../shared/styles';

let willFocusSubscription;
let backPressSubscriptions;

class SubcategoriesListScreen extends Component {
	state = { category: null };

	async componentWillMount() {
		await this.setState({
			category: this.props.navigation.getParam('category')
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
		await this.props.navigation.navigate('servicesList', {
			subcategory,
			category: this.state.category
		});
	};

	renderSubcategories = (subcategory) => (
		<SubcategoryCard
			subcategory={subcategory}
			onPress={() => this.doSelectSubcategory(subcategory)}
			color={this.state.category.color[0]}
		/>
	);

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: 'white' }}
			onPress={() => {
				this.props.navigation.navigate('browse');
			}}
		/>
	);

	render() {
		return (
			<View style={{ flex: 1, overflow: 'hidden' }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: this.state.category.color[0]
					}}
				/>
				<SafeAreaView
					style={{ flex: 1, backgroundColor: colors.white }}
				>
					<CustomHeader
						color={this.state.category.color[0]}
						title={this.state.category.title}
						titleColor={colors.white}
						left={this.headerLeftIcon()}
						span
						height={200}
					/>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: -60,
							// overflow: 'hidden'
						}}
					>
						<FlatList
							data={this.state.category.subcategories}
							renderItem={({ item }) => this.renderSubcategories(item)
							}
							keyExtractor={(item) => item.title}
						/>
						<View style={[styles.bigCircleStyle, { backgroundColor: this.state.category.color[0] }]} />
						<View style={[styles.smallCircleStyle , { backgroundColor: this.state.category.color[0] }]} />
					</View>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	bigCircleStyle: {
		position: 'absolute',
		height: 400,
		width: 400,
		borderRadius: 200,
		zIndex: -1,
		right: -150,
		bottom: -180,
		opacity: 0.3
	},
	smallCircleStyle: {
		position: 'absolute',
		height: 300,
		width: 300,
		borderRadius: 150,
		zIndex: -1,
		left: -50,
		bottom: -180,
		opacity: 0.3
	}
});

export default SubcategoriesListScreen;
