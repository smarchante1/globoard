import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Modal, ScrollView} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { convertHexToRgbString } from './Utilities'
import Icon from 'react-native-vector-icons/FontAwesome';

import Button from "./Button"
import RGBButton from "./RGBButton.js"
import CheckList from "./Checklist"

type Props = {};

export default class BluetoothSwitch extends Component<Props> {
  constructor() {
    let cha;
    super();
    this.manager = new BleManager();
    this.state={
      device: null,
      buttonClicked: false,
      messages: [],
      showList: false,
      isModalVisible: false,
      selectedColor: null,
    };
    
    this.onButtonClick = this.onButtonClick.bind(this);
    let connected = false;
  }

  componentDidMount() {
    const subscription = this.manager.onStateChange(state => {
      if (state === "PoweredOn") {
        this.scanAndConnect();
        console.log("Bluetooth: ON");
      } else {
        console.log("Bluetooth: OFF");
      }
    }, true);
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return;
      }

      console.log(
        "Name: " +
          device.name +
          "| ID: " +
          device.id +
          "| isConnectable: " +
          device.isConnectable
      );

      if (
        device.name === "DSD TECH" ||
        device.id === "D4C2D039-EF9B-6869-B2ED-5E1BAFD973D7"
      ) {
        this.manager.stopDeviceScan();
        device
          .connect()
          .then(device => {
            console.log("Connected to HM-10 module");
            this.connected = true;
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            this.findServicesAndCharacteristics(device);
          })
          .catch(error => {
            console.log("error");
          });
      }
    });
  }

  findServicesAndCharacteristics(device) {
    device.services().then(services => {
      services.forEach((service, i) => {
        console.log("Service UUID: " + service.uuid);
        service.characteristics().then(characteristics => {
          characteristics.forEach((c, i) => {
            if (c.isWritableWithoutResponse) {
              this.cha = c;
            }
          });
        });
      });
    });
  }
 
  sendStringToDevice(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
      console.log(err);
    });
    this.setState({
      selectedColor: null,
    })
  }

  handleColorChange = color => {
    // console.log(color)
    const hexColor = fromHsv(color)
    // console.log(hexColor)
    this.setState({ selectedColor: hexColor })
    this.setColor(hexColor)
  }

  writeToDevice(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
      console.log("Could not write value to Arduino");
    });
    let message = "LED's turned on"
    this.setState({messages: message, buttonClicked: true})
  }

  turnOff(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not turn off leds")
	  });
    let message = "LED's turned off"
    this.setState({messages: message})
  }

  sequentialBlink(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not sequential blink")
	});
    let message = "Sequential Blink style selected"
    this.setState({messages: message})
  }

  shimmer(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not sequential blink")
	});
    let message = "Shimmer style selected"
    this.setState({messages: message})
  }

  alternatingBlink(val) {
    this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not sequential blink")
	});
    let message = "Alternating Blink style selected"
    this.setState({messages: message})
  }

  onButtonClick() {
    this.setState(prevState => ({
      showList: !prevState.showList
    }));
  }

  pinkHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }

  tealHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }

  greenHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }

  yellowHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }

  orangeHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }

  whiteHelper(val){
   this.cha.writeWithoutResponse(val).catch(err => {
	  console.log("Could not change color")
	});
  }


  render() {
    let selectedColor = '#C0392B';


    return (
      <View style={styles.container}>    
        <Icon style={styles.lightBulb} name="lightbulb-o" size={80} color="#BA4AE7" />
        <Text style={styles.connected}>globoard</Text>
        <Text style={styles.tagline}>Make your guitar glo. Pick a setting belo.</Text>
        
        {this.state.buttonClicked && <Text style={styles.notifications}>{this.state.messages}</Text>}
        
        <View style={styles.buttonContainer}>
          <Button onPress={() => this.writeToDevice("VA==")}>
            LED On
          </Button>
            
          <Button onPress={() => this.turnOff("Tw==")}> 
            LED Off 
          </Button>

          <Button onPress={() => this.sequentialBlink("Uw==")}>
            Sequential Blink
          </Button>

          <Button onPress={() => this.alternatingBlink("UAo=")}>
            Alternating Blink
          </Button>
            
          <Button onPress={() => this.shimmer("SQ==")}>
            Shimmer
          </Button>


          <Button onPress={() => this.setState({ isModalVisible: true, })}>
            RGB Indicator Color
          </Button>
          <ScrollView>
            <Modal style={styles.modStyle}
              animationType="slide"
              transparent={false}
              visible={this.state.isModalVisible}
              onRequestClose={() => {
                this.setState({
                  isModalVisible: false,
                })
              }}
            >  
            
            <Icon style={styles.close} name="remove" size={30} color="#4AE7CD" onPress={() => this.setState({ isModalVisible: false, })} />
            
            <Icon style={styles.lightBulb} name="magic" size={50} color="#BA4AE7" />

            <Text style={styles.rgbTagline}>RGB Indicator Color Selector</Text>

              <View style={styles.colorButtonContainer}>
                <TouchableOpacity style={styles.pinkButton}>
                  <RGBButton onPress={() => this.pinkHelper("Tgo=")}>Magenta</RGBButton>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tealButton}>
                  <RGBButton onPress={() => this.tealHelper("Rg==")}>Teal</RGBButton>
                </TouchableOpacity>

                <TouchableOpacity style={styles.greenButton}>
                  <RGBButton onPress={() => this.greenHelper("WQ==")}>Green</RGBButton>
                </TouchableOpacity>

                <TouchableOpacity style={styles.yellowButton}>
                  <RGBButton onPress={() => this.yellowHelper("Rw==")}>Yellow</RGBButton>
                </TouchableOpacity>

                <TouchableOpacity style={styles.orangeButton}>
                  <RGBButton onPress={() => this.orangeHelper("SAo=")}>Orange</RGBButton>
                </TouchableOpacity>

                <TouchableOpacity style={styles.whiteButton}>
                  <RGBButton onPress={() => this.whiteHelper("TAo=")}>White</RGBButton>
                </TouchableOpacity>
              </View>
            </Modal>
          </ScrollView>

          <View style={styles.separator} />
          
          <Icon style={styles.lightBulb} name="check-square" size={50} color="#BA4AE7" />

          <TouchableOpacity>
            <Text style={styles.listTrigger} onPress={this.onButtonClick}>
              Performance Check List
            </Text>
          </TouchableOpacity>

          {this.state.showList ? <CheckList /> : null}
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

  listTrigger: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: '#BA4AE7',
    padding: 5,
  },

  tagline: {
    fontSize: 15,
    textAlign: "center",
	  paddingBottom: 70, 
    color: '#BA4AE7'
  },

  connected: {
    fontFamily: 'Futura',
    color: '#ffffff',
    fontSize: 60,
    textAlign: "center",
    margin: 10,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: '#30b39d',
  },
  
  button: {
    backgroundColor: "#FE434C",
	  fontSize: 20,
  },
  
  notifications: {
    textAlign: "center",
    backgroundColor: '#ffffff',
    color: '#79b3f4',
    padding: 8,
    marginBottom: 30,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: '#ffffff',
  },

  separator: {
    marginVertical: 30,
    borderWidth: 3,
    borderColor: '#BA4AE7',
  },

  picker: {
    flexDirection: 'column',
    height: 400
  },

  close: {
    flexDirection: 'column',
	  justifyContent: 'space-evenly',
    position: 'relative',
    paddingTop: 30,
	  marginTop: 30,
    marginLeft: 10,
    marginRight: 10  },
  
  color: {
    flexDirection: 'column',
    paddingBottom: 600,
    alignItems: 'center'
  },

  pinkButton: {
    borderRadius: 8,
    backgroundColor: '#F059D4',
    margin: 5,
    shadowColor: '#C21BA3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  tealButton: {
    borderRadius: 8,
    backgroundColor: '#54FFF1',
    margin: 5,
    shadowColor: '#1CD9C9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  greenButton: {
    borderRadius: 8,
    backgroundColor: '#33FF7E',
    margin: 5,
    shadowColor: '#06CF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  yellowButton: {
    borderRadius: 8,
    backgroundColor: '#FFC30F',
    margin: 5,
    shadowColor: '#BF8F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  orangeButton: {
    borderRadius: 8,
    backgroundColor: '#FF7512',
    margin: 5,
    shadowColor: '#B84D00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  whiteButton: {
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    margin: 5,
    shadowColor: '#A8A7A7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },

  colorButtonContainer: {
    marginTop: 60
  },

  modStyle: {
    backgroundColor: '#4AE7CD'
  },

  rgbTagline: {
    // fontFamily: 'Thonburi',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 25,
    color: '#BA4AE7',
    fontSize: 25,
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    textShadowColor: '#570f73',
  },

  lightBulb: {
    paddingLeft: 155, 
  }

}); 