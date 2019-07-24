import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity, Dimensions, Button } from "react-native";
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
    const progressCustomStyles = {
      backgroundColor: 'red', 
      borderRadius: 0,
      borderColor: 'orange',
    };

    return(
      <View style={styles.container}>
        <Text style={styles.title}>Are You Performance Ready?</Text>
        <Text style={styles.tagline}>Check off the boxes below!</Text>

        <View>
          <ProgressBarAnimated
            width={barWidth}
            value={this.state.progress}
            backgroundColorOnComplete="#6CC644"
          />
        </View>

          <CheckBox
            title='Battery levels checked and charged.'
            checked={this.state.checked1}
            onPress={() => this.setState({checked1: !this.state.checked1})}
            onPress={increase.bind(this, 'progress', 20)}
          />

          <CheckBox
            title='Strings tuned with tuner.' 
            checked={this.state.checked2}
            onPress={() => this.setState({checked2: !this.state.checked2})}
            onPress={increase.bind(this, 'progress', 20)}
          />

          <CheckBox
            title='Sound test done.' 
            checked={this.state.checked3}
            onPress={() => this.setState({checked3: !this.state.checked3})}
            onPress={increase.bind(this, 'progress', 20)}
          />

          <CheckBox
            title='Cable wrapped securely inside of strap.' 
            checked={this.state.checked4}
            onPress={() => this.setState({checked4: !this.state.checked4})}
            onPress={increase.bind(this, 'progress', 20)}
          />
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

  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ffffff'
  },

  tagline: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ffffff'
  }
})