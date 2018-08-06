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


const initialState = {
    selectedCategory: undefined,
    selectedSubcategory: undefined,
    serviceTitle: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    loading: false
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
        // Reset the result prop to get rid of message
        
    }

    doPostService = async () => {
        Keyboard.dismiss();
        this.setState({ loading: true });
        const { selectedCategory, selectedSubcategory, serviceTitle, phone, location, description } = this.state;
        const servicePost = {
            selectedCategory,
            selectedSubcategory,
            serviceTitle,
            phone,
            location,
            description
        };
        
       await this.props.createService(servicePost);
       this.setState(initialState);
    };

    // TODO: animate when the new picker appears
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

    renderSubcategories() {
        if (this.state.selectedCategory) {
            if (this.state.selectedCategory.subcategories) {
                return (
                    <Item picker style={styles.itemStyle}>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name={this.state.selectedSubcategory ? undefined : 'ios-arrow-down-outline'} />}
                            placeholder="Pick a Category"
                            placeholderStyle={{ color: '#bfc6ea' }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selectedSubcategory}
                            onValueChange={(value) => { this.setState({ selectedSubcategory: value }); }}
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
            return (<Spinner color="white" />);
        }
        return (<View />);
    }

    render() {
        const { titleStyle, formStyle, itemStyle, textAreaStyle, buttonStyle } = styles;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : null}
                    style={{ flex: 1, justifyContent: 'center' }}
                >
                    <Content>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Text style={titleStyle}>Post a Service</Text>
                            <Form style={formStyle}>
                                <Item picker styl={itemStyle}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name={this.state.selectedCategory ? undefined : 'ios-arrow-down-outline'} />}
                                        placeholder="Pick a Category"
                                        placeholderStyle={{ color: '#bfc6ea' }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedCategory}
                                        onValueChange={(value) => this.setState({ selectedCategory: value })}
                                    >
                                        {this.renderPickerItemsCategories()}
                                    </Picker>
                                </Item>
                                {this.renderSubcategories()}
                                <Item style={itemStyle} floatingLabel>
                                    <Label>Service Title</Label>
                                    <Input
                                        value={this.state.serviceTitle}
                                        onChangeText={(text) => this.setState({ serviceTitle: text })}
                                    />
                                </Item>

                                <Item style={itemStyle} floatingLabel>
                                    <Label>Contact Phone</Label>
                                    <Input
                                        value={this.state.phone}
                                        onChangeText={(text) => this.setState({ phone: text })}
                                        // TODO: set keyboard to only numbers
                                    />
                                </Item>
                                <Item style={itemStyle} floatingLabel>
                                    <Label>Location</Label>
                                    <Input
                                        value={this.state.location}
                                        onChangeText={(text) => this.setState({ location: text })}
                                        // TODO: User EXPO library. follow trello for what to do
                                    />
                                </Item>
                                <Textarea
                                    style={textAreaStyle}
                                    rowSpan={5}
                                    bordered
                                    placeholder="Describe your Service Here"
                                    value={this.state.description}
                                    onChangeText={(text) => this.setState({ description: text })}
                                />
                                {/* TODO: add char count under textArea */}
                            </Form>
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
        fontSize: 30,
        margin: 30
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
    }
};

function mapStateToProps(state) {
    return {
        categories: state.categories,
        result: state.postServiceResult
     };
}

export default connect(mapStateToProps, { createService, resetMessagePost })(PostServiceScreen);
