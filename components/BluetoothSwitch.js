import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Modal} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import { convertHexToRgbString } from './Utilities'

import Button from "./Button.js"
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

  sendStringToDevice = async data => {
    try {
      await this.cha.writewithoutResponse(data)
      this.setState({
        selectedColor: null,
      })
    } catch (e) {
      console.log(e)
    }
  }

  handleColorChange = color => {
    const hexColor = fromHsv(color)
    this.setState({ selectedColor: hexColor })
    this.setColor(hexColor)
  }

  setColor = async color => {
    try {
      await this.cha.writewithoutResponse(convertHexToRgbString(color))
    } catch (e) {
      console.log(e)
    }
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

  render() {
    const gradient = `linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%), repeating-linear-gradient(-115deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px), repeating-linear-gradient(115deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)`;

    return (
      <View style={styles.container}>    
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
            Pick a Color
          </Button>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => {
              this.setState({
                isModalVisible: false,
              })
            }}
          >  
          <Text style={styles.close} onPress={() => this.setState({ isModalVisible: false, })}>
            Close
          </Text>
                <ColorPicker
                  style={styles.picker}
                  onColorChange={this.handleColorChange}
                  color={this.state.selectedColor}
                />
    
          </Modal>


          <View style={styles.separator} />
                  
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
    borderWidth: 4,
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
	  marginTop: 50,
    marginLeft: 10,
    marginRight: 10  }

}); 