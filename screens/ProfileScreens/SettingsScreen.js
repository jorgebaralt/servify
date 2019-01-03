import React, { Component } from 'react';
import {
	DeviceEventEmitter,
	View,
	ScrollView,
	Text,
	SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '../../api';
import { pageHit } from '../../shared/ga_helper';
import { colors } from '../../shared/styles';
import { CustomHeader, Button } from '../../components/UI';

class SettingsScreen extends Component {
	componentDidMount() {
		pageHit('Settings Screen');
	}

	doLogOut = async () => {
		await logout();
	};

	headerLeftIcon = () => (
		<Ionicons
			name="ios-arrow-back"
			size={32}
			style={{ color: colors.black }}
			onPress={() => {
				this.props.navigation.goBack();
			}}
		/>
	);

	render() {
		return (
			<View style={{ flex: 1 }}>
				<SafeAreaView
					style={{
						flex: 0,
						backgroundColor: colors.white
					}}
				/>
				<SafeAreaView
					style={{ flex: 1, }}
					forceInset={{ bottom: 'never' }}
				>
					<CustomHeader
						color={colors.white}
						title="Settings"
						left={this.headerLeftIcon()}
					/>
					<ScrollView style={{ flex: 1, backgroundColor: colors.white, paddingLeft: 20, paddingRight: 20 }}>
						<Button color={colors.danger} style={{ width: '100%'}} onPress={this.doLogOut}>
							<Text>Log out</Text>
						</Button>
					</ScrollView>
				</SafeAreaView>
			</View>
		);
	}
}

export default SettingsScreen;
