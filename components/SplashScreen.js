import React, {Fragment, Component, Button} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

export default class SplashScreen extends React.Component {
   constructor(props) {
    super(props);
      this.state={
      
      };
   }

  render() {
    const viewStyles = [
      styles.container,
      { backgroundColor: 'orange' }
    ];
    const textStyles = {
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold'
    };

    return (
      <View style={viewStyles}>
        <Text style={textStyles} onPress={this.onButtonPress}>
          Globoard
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});