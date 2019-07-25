import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Button, Alert } from "react-native";
import { CheckBox } from 'react-native-elements';
import ProgressBarAnimated from 'react-native-progress-bar-animated';

export default class Checklist extends Component {
  constructor (){
    super();
    this.state={
      checkedItems: null,
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      progress: 20,
      progressWithOnComplete: 0,
      progressCustomized: 0,
    } 
    increase = (key, value) => {
      this.setState({
        [key]: this.state[key] + value,
      });
    }
  }

  render() {
    const barWidth = Dimensions.get('screen').width - 30;

    return(
      <View style={styles.container}>
        <Text style={styles.title}>Are You Performance Ready?</Text>
        <Text style={styles.tagline}>Check off the boxes below!</Text>

        <View style={styles.barContainer}> 
          <ProgressBarAnimated 
            width={barWidth}
            value={this.state.progressWithOnComplete}
            backgroundColorOnComplete="#BA4AE7"
            onComplete={() => {
              Alert.alert('All Prepared!', 'You\'re ready to rock!');
            }}
          />
        </View>

        <View style={styles.listContainer}>
          <CheckBox
            textStyle={styles.fontStyle}
            containerStyle={styles.checkboxContainer}
            title='Battery levels checked and charged.'
            checked={this.state.checked1}
            onPress={() => {this.setState({checked1: !this.state.checked1})} }
            onPress={increase.bind(this, 'progressWithOnComplete', 20)}
          />

          <CheckBox
            textStyle={styles.fontStyle}
            containerStyle={styles.checkboxContainer}
            title='Strings tuned with tuner.' 
            checked={this.state.checked2}
            onPress={() => this.setState({checked2: !this.state.checked2})}
            onPress={increase.bind(this, 'progressWithOnComplete', 20)}
          />

          <CheckBox
            textStyle={styles.fontStyle}
            containerStyle={styles.checkboxContainer}
            title='Sound test done.' 
            checked={this.state.checked3}
            onPress={() => this.setState({checked3: !this.state.checked3})}
            onPress={increase.bind(this, 'progressWithOnComplete', 20)}
          />

          <CheckBox
            textStyle={styles.fontStyle}
            containerStyle={styles.checkboxContainer}
            title='Cable wrapped securely inside of strap.' 
            checked={this.state.checked4}
            onPress={() => this.setState({checked4: !this.state.checked4})}
            onPress={increase.bind(this, 'progressWithOnComplete', 20)}
          />

          <CheckBox
            textStyle={styles.fontStyle}
            containerStyle={styles.checkboxContainer}
            title='Spare picks are easily accessible.' 
            checked={this.state.checked4}
            onPress={() => this.setState({checked4: !this.state.checked4})}
            onPress={increase.bind(this, 'progressWithOnComplete', 20)}
          />
        </View>
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

  listContainer:{
    backgroundColor:'#BA4AE7',
    // borderRadius: 5, 
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  checkboxContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: '#ffffff',
    backgroundColor: 'transparent', 
  },

  barContainer: {
    paddingTop: 15,
    paddingBottom: 10,
  },

  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff'
  },

  tagline: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ffffff'
  },

  fontStyle: {
    color: 'white'
  }
})