import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
// import { CheckBox } from 'react-native-elements'

export default class Checklist extends Component {
  constructor (){
    super();
    this.state={
      checkedItems: null
    }
  };


  render() {
    return(
      <Text>Test</Text>
      
    );
  }

}