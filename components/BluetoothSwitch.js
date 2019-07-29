import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Alert, TouchableOpacity, Modal} from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { convertHexToRgbString } from './Utilities'
import Icon from 'react-native-vector-icons/FontAwesome';


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



  // setColor(rawColor) {
  //   console.log("VVVVVVVVVVVVVVVVV")

  //   const color = rawColor.replace(/^#/, "")
  //   console.log(color)
  //   const red = parseInt(color.slice(0,2), 16)
  //   const green = parseInt(color.slice(2,4), 16)
  //   const blue = parseInt(color.slice(4,6), 16)

  //   const colorBytes = String.fromCharCode(red, green, blue)
  //   console.log(colorBytes)
  //   // const b64color = btoa(color)
  //   // const b64color = base64.encode(color);
  //   console.log(red, green, blue)
  //   console.log("^^^^^^^^^^^^^^^^^^")
  //   // this.cha.writeWithoutResponse(base64.encode(red))
  //   // .catch(err => {
  //   //   console.log(err);
  //   // });
  //   // this.cha.writeWithoutResponse(base64.encode(green))
  //   // .catch(err => {
  //   //   console.log(err);
  //   // });
  //   // this.cha.writeWithoutResponse(base64.encode(blue))
  //   // .catch(err => {
  //   //   console.log(err);
  //   // });

  // }

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

  render() {
    let selectedColor = '#C0392B';

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
          <TouchableOpacity>
            <Button onPress={() => this.pinkHelper("Tgo=")}>Pink</Button>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text>Blue</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text>Green</Text>
          </TouchableOpacity>

            <TouchableOpacity style={styles.color} onPress={console.log('I work!')}>
              <Text>
                Change Color
              </Text>
            </TouchableOpacity>
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
    marginRight: 10  },
  
  color: {
    flexDirection: 'column',
    paddingBottom: 600,
    alignItems: 'center'
  }

}); 