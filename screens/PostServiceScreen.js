import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    Keyboard,
    Platform
} from 'react-native';
import {
    Text,
    Content,
    Form,
    Label,
    Spinner,
    Item,
    Input,
    Textarea,
    Picker,
    Icon,
    Button,
    Toast
} from 'native-base';
import { connect } from 'react-redux';
import { createService, resetMessagePost } from '../actions';

const maxCharCount = 120;
const initialState = {
    selectedCategory: undefined,
    selectedSubcategory: undefined,
    title: '',
    email: '',
    phone: '',
    zipCode: '',
    description: '',
    loading: false,
    descriptionCharCount: maxCharCount
};

class PostServiceScreen extends Component {
    static navigationOptions={
        title: 'Post',
        tabBarIcon: ({ tintColor }) => (<Icon type="Entypo" name="plus" style={{ color: tintColor }} />)
    };
    
    state = initialState;

    componentWillUpdate(nextProps){
        const { result } = nextProps;
        const { success, error } = result;
        if(success){
            Toast.show({
                text: success,
                buttonText: 'OK',
                duration: 2000,
                type: 'success'
            });
            this.props.resetMessagePost();
        }
        if(error){
            Toast.show({
                text: error,
                buttonText: 'OK',
                duration: 2000,
                type: 'warning'
            });
            this.props.resetMessagePost();
        }
    }

    doPostService = async () => {
        Keyboard.dismiss();
        this.setState({ loading: true });
        const { selectedCategory, selectedSubcategory, title, phone, zipCode, description } = this.state;
        const servicePost = {
            selectedCategory,
            selectedSubcategory,
            title,
            phone,
            zipCode,
            description
        };
        
       await this.props.createService(servicePost);
       this.setState(initialState);
    };

    // text is only what I have typed, not value
    phoneChangeText = (text) => {
        const input = text.replace(/\D/g, '').substring(0, 10);
        const left = input.substring(0, 3);
        const middle = input.substring(3, 6);
        const right = input.substring(6, 10);

        if(input.length > 6){
            this.setState({ phone: `(${left}) ${middle} - ${right}` });
        }else if(input.length > 3){
            this.setState({ phone: `(${left}) ${middle}` });
        }else if(input.length > 0){
            this.setState({ phone: `(${left}` });
        }
    }

    descriptionChangeText = (text) => {
        const { descriptionCharCount } = this.state;
        if(descriptionCharCount < maxCharCount){
            this.setState({ description: text });
        }
        this.setState({ descriptionCharCount: maxCharCount - text.length });
    }

    renderPickerItemsCategories() {
        return this.props.categories.map((category) => (
            <Picker.Item
                key={category.id}
                label={category.title}
                value={category}
            />
        ));
    }

    renderPickerItemsSubcategories() {
        return this.state.selectedCategory.subcategories.map((subcategory) => (
            <Picker.Item
                key={subcategory.id}
                label={subcategory.title}
                value={subcategory}
            />
        ));
    }
    
    // TODO: animate when the new picker appears
    renderSubcategories() {
        if (this.state.selectedCategory) {
            if (this.state.selectedCategory.subcategories) {
                return (
                    <Item picker style={{ margin: 10, marginLeft: 15, width: '90%' }}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name={this.state.selectedSubcategory ? undefined : 'ios-arrow-down-outline'} />}
                            placeholder="Pick a Subcategory"
                            placeholderStyle={{ color: '#bfc6ea', left: -15 }}
                            selectedValue={this.state.selectedSubcategory}
                            onValueChange={(value) => { this.setState({ selectedSubcategory: value }); }}
                            textStyle={{ left: -15 }}
                        >
                            {this.renderPickerItemsSubcategories()}
                        </Picker>
                    </Item>
                );
            }
        }
        return(<View />);
    }  
    
    renderSpinner() {
        if (this.state.loading) {
            return (<Spinner color="orange" />);
        }
        return (<View />);
    }

    render() {
        const { titleStyle, formStyle, itemStyle, textAreaStyle, buttonStyle, charCountStyle } = styles;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : null}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <Content>
                    <Text style={titleStyle}>Post a new service</Text>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Form style={formStyle}>
                                <Item picker style={{ margin: 10, marginLeft: 15, width: '90%' }}>
                                    <Picker
                                        mode="dropdown"
                                        style={{ width: undefined }}
                                        placeholder="Pick a Category"
                                        placeholderStyle={{ color: '#bfc6ea', left: -15 }}
                                        iosIcon={<Icon name={this.state.selectedCategory ? undefined : 'ios-arrow-down-outline'} />}
                                        selectedValue={this.state.selectedCategory}
                                        onValueChange={(value) => this.setState({ selectedCategory: value })}
                                        textStyle={{ left: -15 }}
                                    >
                                        {this.renderPickerItemsCategories()}
                                    </Picker>
                                </Item>

                                {this.renderSubcategories()}
                                
                                <Item style={itemStyle} floatingLabel>
                                    <Label>Service Title</Label>
                                    <Input
                                        value={this.state.title}
                                        onChangeText={(text) => this.setState({ title: text })}
                                        maxLength={36}
                                    />
                                </Item>

                                <Item style={itemStyle} floatingLabel>
                                    <Label>Contact Phone</Label>
                                    <Input
                                        value={this.state.phone}
                                        onChangeText={(text) => this.phoneChangeText(text)}
                                        keyboardType="phone-pad"
                                        maxLength={16}
                                    />
                                </Item>
                                <Item style={itemStyle} floatingLabel>
                                    <Label>Address, Zip Code, or Location</Label>
                                    <Input
                                        value={this.state.zipCode}
                                        onChangeText={(text) => this.setState({ zipCode: text })}
                                        keyboardType="numeric"
                                    />
                                </Item>
                                <Textarea
                                    style={textAreaStyle}
                                    rowSpan={4}
                                    bordered
                                    placeholder="Describe your Service Here"
                                    maxLength={maxCharCount}
                                    value={this.state.description}
                                    onChangeText={(text) => this.descriptionChangeText(text)}
                                />
                            </Form>
                            <Text style={charCountStyle}>{this.state.descriptionCharCount}</Text>
                            {this.renderSpinner()}
                            <View>
                                <Button
                                    bordered
                                    dark
                                    rounded
                                    style={buttonStyle}
                                    onPress={() => this.doPostService()}
                                >
                                    <Text>Submit</Text>
                                </Button>
                            </View>
                        </View>
                        {/* TODO: Services should be first Submitted for approval. */}
                        {/* TODO: Users will also be able to contact you through your account email, create message */}

                    </Content>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}
const styles = {
    titleStyle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 26,
        margin: 25
    },
    formStyle: {
        width: '80%'
    },
    itemStyle: {
        margin: 10,
    },
    textAreaStyle: {
        margin: 10,
        marginTop: 30
    },
    buttonStyle: {
        marginTop: 10,
        marginLeft: '50%',
    },
    charCountStyle: {
        right: '-33%',
        color: '#bfc6ea'
    }
};

function mapStateToProps(state) {
    return {
        categories: state.categories,
        result: state.postServiceResult
     };
}

export default connect(mapStateToProps, { createService, resetMessagePost })(PostServiceScreen);
