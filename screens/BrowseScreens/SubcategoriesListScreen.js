import React, { Component } from 'react';
import { DeviceEventEmitter, FlatList, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
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
		backPressSubscriptions.add(() => this.onBackPressed());
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

	renderSubcategories = (subcategory) => (
		<SubcategoryCard
			subcategory={subcategory}
			onPress={() => this.doSelectSubcategory(subcategory)}
			color={this.state.category.color[0]}
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
					forceInset={{ bottom: 'never' }}
				>
					<CustomHeader
						color={this.state.category.color[0]}
						title={this.state.category.title}
						titleColor={colors.white}
						left={this.headerLeftIcon()}
						titleMarginTop={30}
						span
						height={120}
					/>
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: -60
							// overflow: 'hidden'
						}}
					>
						<FlatList
							data={this.state.category.subcategories}
							renderItem={({ item }) => this.renderSubcategories(item)
							}
							keyExtractor={(item) => item.title}
						/>
						<View
							style={[
								styles.bigCircleStyle,
								{
									backgroundColor: this.state.category
										.color[0]
								}
							]}
						/>
						<View
							style={[
								styles.smallCircleStyle,
								{
									backgroundColor: this.state.category
										.color[0]
								}
							]}
						/>
					</View>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	bigCircleStyle: {
		position: 'absolute',
		height: 300,
		width: 300,
		borderRadius: 150,
		zIndex: -1,
		right: -120,
		bottom: -140,
		opacity: 0.3
	},
	smallCircleStyle: {
		position: 'absolute',
		height: 200,
		width: 200,
		borderRadius: 100,
		zIndex: -1,
		left: -50,
		bottom: -130,
		opacity: 0.3
	}
});

export default SubcategoriesListScreen;
