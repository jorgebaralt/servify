import React from 'react';
import { ScrollView, Text, View, Keyboard } from 'react-native';
import { Button, FloatingLabelInput, TextArea } from '../../components/UI';
import { colors, globalStyles } from '../../shared/styles';
import { formatPhone } from '../../shared/helpers';

// format phone text
const phoneChangeText = (text, props) => {
	const result = formatPhone(text);
	props.phoneChange(result);
};

const onNext = (props) => {
	Keyboard.dismiss();
	props.onNext();
};

const ServiceInformation = (props) => (
	<ScrollView
		style={{
			width: props.width,
			paddingLeft: 20,
			paddingRight: 20
		}}
		keyboardShouldPersistTaps="handled"
	>
		<Text style={globalStyles.stepStyle}>Step 2</Text>
		<Text style={[globalStyles.sectionTitle, { marginTop: 10 }]}>
			Fill your service information.
		</Text>
		<Text style={globalStyles.publishDescriptionStyle}>
			Users will need some information from you before hiring you for a
			job.
		</Text>

		{/* Service Title */}
		<FloatingLabelInput
			value={props.state.title}
			label="Service title"
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			onChangeText={(text) => props.titleChange(text)}
			style={{ marginTop: 30 }}
			maxLength={25}
		/>
		{/* Contact Email */}
		<FloatingLabelInput
			value={props.state.contactEmail}
			label="Contact email"
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			onChangeText={(text) => props.contactEmailChange(text)}
			style={{ marginTop: 30 }}
			maxLength={25}
			autoCapitalize="none"
		/>

		{/* Phone */}
		<FloatingLabelInput
			value={props.state.phone}
			label="Contact phone"
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			onChangeText={(text) => phoneChangeText(text, props)}
			style={{ marginTop: 30 }}
			maxLength={16}
			keyboardType="phone-pad"
		/>
		{/* Description */}
		<TextArea
			style={{ marginTop: 30 }}
			label="Description"
			size={40}
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			multiline
			bordered
			numberOfLines={6}
			placeholder="Describe your Service Here"
			value={props.state.description}
			onChangeText={(text) => props.descriptionChange(text)}
		/>
		{/* Website */}
		<FloatingLabelInput
			value={props.state.website}
			label="Website (optional)"
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			onChangeText={(text) => props.websiteChange(text)}
			style={{ marginTop: 30 }}
			maxLength={25}
			autoCapitalize="none"
		/>
		{/* Provider Description */}
		<TextArea
			style={{ marginTop: 30 }}
			label="Provider description (optional)"
			size={40}
			firstColor={colors.darkGray}
			secondColor={colors.secondaryColor}
			fontColor={colors.black}
			multiline
			bordered
			numberOfLines={6}
			placeholder="Describe what you or your company are about"
			value={props.state.providerDescription}
			onChangeText={(text) => props.providerDescriptionChange(text)}
		/>
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
				onPress={() => {
					props.onBack();
					Keyboard.dismiss();
				}}
				textColor={colors.primaryColor}
			>
				<Text>Back</Text>
			</Button>
			<Button
				color={colors.primaryColor}
				onPress={() => onNext(props)}
				style={{ width: '40%' }}
				disabled={
					props.state.title === ''
					|| props.state.phone === ''
					|| props.state.description === ''
				}
			>
				<Text>Next</Text>
			</Button>
		</View>
	</ScrollView>
);

export default ServiceInformation;
