import React, {Fragment, Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Checklist from './components/Checklist'
import  BluetoothSwitch  from './components/BluetoothSwitch';
import SplashScreen from './components/SplashScreen';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class App extends Component {
   constructor(props) {
    super(props);
    this.state={
      isLoading: true,
    };
   }

  onButtonPress = () => {
    this.setState({
      isLoading: false,
    });
  }

  render() {
    // if (this.state.isLoading) {
    //   return <SplashScreen />;
    // }

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
              <View style={styles.body}>
            <BluetoothSwitch />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    );
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#4AE7CD',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: '#4AE7CD',
    height: 1000,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: '#5FFEE4',
  },
  highlight: {
    fontWeight: '700',
  },

});

