import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, children }) => {
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
    // backgroundColor: '#baffe7',
    borderRadius: 3,
    borderWidth: 3,
    borderColor: '#ffffff',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    shadowColor: '#30b39d',
    shadowOffset: { height: 2, width: 1 }, 
    shadowOpacity: 1, 
    shadowRadius: 4, 
  },

  textStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '400',
    paddingTop: 10,
    paddingBottom: 10,
  }
};

export default Button;