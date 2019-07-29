import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const RGBButton = ({ onPress, children }) => {
  const { buttonStyle, textStyle } = styles;
    return (
      <TouchableOpacity onPress={onPress} style={ buttonStyle }>
        <Text style={ textStyle }>
          {children}
        </Text>
      </TouchableOpacity>
    );
};

const styles = {
  buttonStyle: {
    alignSelf: 'stretch',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    marginTop: 10
  },

  textStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  }
};

export default RGBButton;