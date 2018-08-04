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
    Button
} from 'native-base';
import { connect } from 'react-redux';
import { createService } from '../actions';


const initialState = {
    selectedCategory: undefined,
    selectedSubcategory: undefined,
    title: '',
    email: '',
    phone: '',
    location: '',
    description: ''
};

class PostServiceScreen extends Component {
    state = initialState;

    doPostService = () =>{
        const {selectedCategory, selectedSubcategory, title, phone,location,description} = this.state;
        Keyboard.dismiss();
        const servicePost = {
            selectedCategory,
            selectedSubcategory,
            title,
            phone,
            location,
            description
        };
        this.setState(initialState);
        this.props.createService(servicePost);
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
                                        value={this.state.title}
                                        onChangeText={(text) => this.setState({ title: text })}
                                    />
                                </Item>

                                <Item style={itemStyle} floatingLabel>
                                    <Label>Contact Phone</Label>
                                    <Input
                                        value={this.state.phone}
                                        onChangeText={(text) => this.setState({ phone: text })}
                                    />
                                </Item>
                                <Item style={itemStyle} floatingLabel>
                                    <Label>Location</Label>
                                    <Input
                                        value={this.state.location}
                                        onChangeText={(text) => this.setState({ location: text })}
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
    buttonStyle:{
        marginTop: 10,
        marginLeft: '50%'
    }
};

function mapStateToProps(state) {
    return { categories: state.categories };
}

export default connect(mapStateToProps, { createService })(PostServiceScreen);
