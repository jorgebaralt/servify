import React, { Component } from 'react';
import {
	ScrollView,
	Text,
	View,
	ActivityIndicator,
	StyleSheet,
	FlatList
} from 'react-native';
import { Button, FadeImage } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import {
	Category,
	Subcategory,
	Location,
	Miles,
	Phone,
	Description,
	Tools
} from '../../assets/svg';

class ServiceReview extends Component {
	onNext = async () => {
		this.scrollview.scrollToEnd();
		await this.props.onComplete();
	};

	renderSpinner() {
		if (this.props.loading) {
			return (
				<ActivityIndicator
					style={{ marginTop: 20, marginBottom: 20 }}
					size="large"
					color={colors.primaryColor}
				/>
			);
		}
	}

	renderSubcategory = () => {
		const { state } = this.props;
		if (
			state.selectedCategory
			&& state.selectedCategory.subcategories
			&& state.selectedSubcategory
		) {
			return (
				<View style={styles.viewDivider}>
					<Subcategory
						height={20}
						width={20}
						style={{ marginTop: 5 }}
					/>
					<Text style={styles.textServiceStyle}>
						{state.selectedSubcategory.title}
					</Text>
				</View>
			);
		}
	};

	renderEachImage = (item) => (
		<FadeImage
			style={{
				height: 100,
				width: 100,
				marginHorizontal: 10,
				borderRadius: 5
			}}
			uri={item.image}
		/>
	);

	renderImages = () => {
		const { state } = this.props;
		if (state.images && state.images.length > 0) {
			return (
				<View>
					<Text
						style={{
							color: colors.secondaryColor,
							fontSize: 20,
							marginVertical: 10
						}}
					>
						Service Images
					</Text>
					<FlatList
						data={state.images}
						renderItem={({ item }) => this.renderEachImage(item)}
						keyExtractor={(item) => item.title}
						horizontal
					/>
				</View>
			);
		}
	};

	render() {
		const { state } = this.props;
		return (
			<ScrollView
				ref={(scrollview) => { this.scrollview = scrollview; }}
				style={{
					width: this.props.width,
					paddingLeft: 20,
					paddingRight: 20
				}}
			>
				<Text style={globalStyles.stepStyle}>Step 5</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					Confirm the information
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>
					No worries, you will also be able to edit it later and
					update your information
				</Text>

				<View style={[styles.viewDivider, { marginTop: 40 }]}>
					<Category height={20} width={20} style={{ marginTop: 0 }} />
					<Text style={styles.textServiceStyle}>
						{state.selectedCategory
							? state.selectedCategory.title
							: ''}
					</Text>
				</View>

				{this.renderSubcategory()}

				<View style={styles.viewDivider}>
					<Tools height={20} width={20} style={{ marginTop: 0 }} />
					<Text style={styles.textServiceStyle}>{state.title}</Text>
				</View>

				<View style={styles.viewDivider}>
					<Phone height={20} width={20} style={{ marginTop: 0 }} />
					<Text style={styles.textServiceStyle}>{state.phone}</Text>
				</View>

				<View style={styles.viewDivider}>
					<Description
						height={20}
						width={20}
						style={{ marginTop: 0 }}
					/>
					<Text style={styles.textServiceStyle}>
						{state.description}
					</Text>
				</View>

				<View style={styles.viewDivider}>
					<Location height={20} width={20} style={{ marginTop: 0 }} />
					<Text style={styles.textServiceStyle}>
						{state.location}
					</Text>
				</View>

				<View style={styles.viewDivider}>
					<Miles height={20} width={20} style={{ marginTop: 0 }} />
					<Text style={styles.textServiceStyle}>{state.miles}</Text>
				</View>
				{this.renderImages()}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						marginTop: 40,
						marginBottom: 40
					}}
				>
					<Button
						bordered
						color={colors.primaryColor}
						onPress={this.props.onBack()}
						textColor={colors.primaryColor}
					>
						<Text>Edit</Text>
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={() => this.onNext()}
						style={{ width: '40%' }}
					>
						<Text>Submit</Text>
					</Button>
				</View>
				{this.renderSpinner()}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	textServiceStyle: {
		fontSize: 18,
		marginLeft: 10,
		fontWeight: '500',
		color: colors.darkerGray
	},
	viewDivider: { flexDirection: 'row', marginTop: 20 }
});

export default ServiceReview;
