import React, {Component} from 'react';
import {View,ScrollView,Dimensions} from 'react-native'
import {Button,Text,Body} from 'native-base'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Slides extends Component{
    renderSlides=()=>{
        return this.props.data.map((slide,i)=>{
            return(
                    <View key={slide.text} style={[styles.slideStyle,{backgroundColor: slide.color }]}>
                        <Text style={styles.textStyle}>{slide.text}</Text>
                        <View style={{flexDirection:'row'}}>
                            {this.renderDots(i)}
                        </View>
                        {this.renderLastSlide(i)}

                    </View>

            );
        })
    };
    renderLastSlide(i){
        if(i === this.props.data.length - 1){
            return (
                <View style={styles.buttonStyle}>
                    <Button
                        primary
                        onPress={this.props.onComplete}
                    >
                        <Text>Lets Go!</Text>
                    </Button>
                </View>

            )
        }
    }
    renderDots(current){
        return this.props.data.map((slide,i)=>{
            if(i === current){
                return(
                    <View key={i} style={styles.currentDot}></View>
                )
            }
            else{
                return(
                    <View key={i} style={styles.defaultDot}></View>
                )
            }
        })
    }
    render(){
        return(
            <ScrollView
                horizontal
                style={{flex:1}}
                pagingEnabled
            >
                {this.renderSlides()}
            </ScrollView>
        )
    }
}
const styles={
    slideStyle:{
        flex:1,
        alignItems:'center',
        width:SCREEN_WIDTH,
        justifyContent:'center'
    },
    textStyle:{
        fontSize:30,
        color:'white',
        textAlign:'center'
    },
    buttonStyle:{
        marginTop: 20
    },
    defaultDot:{
        height: 10,
        width: 10,
        backgroundColor:'#bbb',
        borderRadius:100/2,
        margin: 10
    },
    currentDot:{
        height: 10,
        width: 10,
        backgroundColor:'#FAFAFA',
        borderRadius:100/2,
        margin: 10,
    }
};
export default Slides;