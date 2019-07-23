import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { CheckBox } from 'react-native-elements'

export default class Checklist extends Component {
  constructor (){
    super();
    this.state={
      checkedItems: null
    }
  };


  render() {
    return(
      <View>
        <Text>Are Your Performance Ready?</Text>
        <Text>Check off the boxes below!</Text>
      </View> 
    );
  }
}

const styles = StyleSheet.create({  
  container: {
    flexDirection: 'column',
	  justifyContent: 'space-evenly',
    position: 'relative',
	  marginTop: 50,
    marginLeft: 10,
    marginRight: 10
  },
})