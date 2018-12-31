import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, ListPicker } from '../../../components/UI';
import { colors, globalStyles } from '../../../shared/styles';

class ServiceCategory extends Component {
	state = {
		categoryModalVisible: false,
		subcategoryModalVisible: false,
	};

	onNext = () => {
		this.props.onNext();
	}

	renderSubcategoriesPicker() {
		if (this.props.state.selectedCategory) {
			if (this.props.state.selectedCategory.subcategories) {
				return (
					<ListPicker
						onPress={() => this.setState({ subcategoryModalVisible: true })
						}
						visible={this.state.subcategoryModalVisible}
						callback={(selectedSubcategory) => {
							this.props.selectSubcategory(selectedSubcategory);
							this.setState({ subcategoryModalVisible: false });
						}}
						label="Subcategory"
						selected={this.props.state.selectedSubcategory}
						placeholder="Pick a subcategory"
						title="Pick a subcategory"
						data={this.props.state.selectedCategory.subcategories}
						color={colors.secondaryColor}
						style={{ marginTop: 50 }}
					/>
				);
			}
		}
	}

	render() {
		const { ...props } = this.props;
		return (
			<ScrollView
				style={{
					width: props.width,
					paddingLeft: 20,
					paddingRight: 20
				}}
				keyboardShouldPersistTaps="always"
			>
				<Text style={globalStyles.stepStyle}>Step 1</Text>
				<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
					Select a category for your service.
				</Text>
				<Text style={globalStyles.publishDescriptionStyle}>To narrow customer search, we need to gather some information about your service.</Text>
				{/* Pick category */}
				<ListPicker
					onPress={() => this.setState({ categoryModalVisible: true })
					}
					visible={this.state.categoryModalVisible}
					callback={(selectedCategory) => {
						this.props.selectCategory(selectedCategory);
						this.setState({ categoryModalVisible: false });
					}}
					label="Category"
					selected={this.props.state.selectedCategory}
					placeholder="Pick a category"
					title="Pick a category"
					color={colors.secondaryColor}
					data={props.categories}
					style={{ marginTop: 30 }}
				/>
				{this.renderSubcategoriesPicker()}
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
						onPress={props.onBack}
					>
						Cancel
					</Button>
					<Button
						color={colors.primaryColor}
						onPress={this.props.onNext}
						style={{ width: '40%' }}
						disabled={this.props.state.selectedCategory === undefined || this.props.state.selectedCategory.subcategories ? this.props.state.selectedSubcategory === undefined : false}
					>
						Next
					</Button>
				</View>
			</ScrollView>
		);
	}
}

export default ServiceCategory;
