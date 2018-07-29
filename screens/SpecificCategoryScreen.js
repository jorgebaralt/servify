import React, { Component } from 'react';
import { View} from 'react-native';
import { Text } from 'native-base';

class SpecificCategoryScreen extends Component {

  renderCategoryPosts(){
    
  }

  render() {
    if(this.props.selectedCategory.subcategory){
     return this.renderSubcategories();
    }
      return this.renderCategoryPosts();
    }
  }

export default SpecificCategoryScreen;
