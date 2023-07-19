import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns'; // Import the date-fns library for date formatting
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import { AuthContext } from '../../AuthContext';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function Pres_CreateScreen({navigation}) {
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const handleModalButtonPress = () => {
    if (modalButtonText === 'Try again') {
      setModalVisible(false);
    } else if (modalButtonText === 'OK') {
      setModalVisible(false);
      navigation.goBack();
    }
  
    // Close the modal
    setModalVisible(false);
  };

  const [presType, setPresType] = useState('');
  const [presSpecialization, setPresSpecialization] = useState('');
  const [presVenue, setPresVenue] = useState('');
  const [presDate, setPresDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [presTime, setPresTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [presTypeError, setPresTypeError] = useState(false);
  const [presSpecializationError, setPresSpecializationError] = useState(false);

  const handlePresTypeChange = (value) => {
    setPresType(value);
    if (value === '') {
      setPresTypeError(true);
    } else {
      setPresTypeError(false);
    }
  };

  const handlePresSpecializationChange = (value) => {
    setPresSpecialization(value);
    if (value === '') {
      setPresSpecializationError(true);
    } else {
      setPresSpecializationError(false);
    }
  };

  const handlePresVenueChange = (value) => {
    setPresVenue(value);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setPresDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setPresTime(time);
    }
  }
  
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const handleCancelDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleCancelTimePicker = () => {
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    // Convert selectedDate to PostgreSQL DATE format
    const formattedDate = presDate ? format(presDate, 'yyyy-MM-dd') : null;
    // Convert selectedTime to PostgreSQL TIME format
    const formattedTime = presTime ? format(presTime, 'HH:mm:ss') : null;
    // Implement submit functionality here
    try {
      if (!presType || !presSpecialization || !presDate || !presTime) {
        setModalTitle('Error');
        setModalMessage('Please ensure that you select all the required fields');
        setModalButtonText('Try again');
        setModalVisible(true);
        return;
      }  
      const response = await fetch('http://3.26.23.172/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          presType,
          presSpecialization,
          presVenue,
          presDate: formattedDate,
          presTime: formattedTime,
        }),
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Presentation created');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        console.error('Error creating presentation:', response.statusText);
        // Handle any error logic here
      }
    } catch (error) {
      console.error('Error creating presentation:', error);
      // Handle any error logic here
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20 }}>
        <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center' }}>
          Enter Presentation Details
        </Text>
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Presentation Type:</Text>
          <View style={[styles.pickerContainer, presTypeError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
            <Picker selectedValue={presType} onValueChange={handlePresTypeChange}>
              <Picker.Item label="Select Presentation Type" value="" style={{ fontSize: 14, color: 'grey' }} />
              <Picker.Item label="Online Presentation" value="Online Presentation" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Physical Presentation" value="Physical Presentation" style={{ fontSize: 14 }} />
              <Picker.Item label="Poster Presentation" value="Poster Presentation" style={{ fontSize: 14 }} />
            </Picker>
          </View>
          {presTypeError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid presentation type</Text>
            </View>
          )}
        </View>
        
        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>For Specialization:</Text>
          <View style={[styles.pickerContainer, presSpecializationError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
            <Picker selectedValue={presSpecialization} onValueChange={handlePresSpecializationChange}>
              <Picker.Item label="Select Presentation Specialization" value="" style={{ fontSize: 14, color: 'grey' }} />
              <Picker.Item label="Any" value="Any" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Information System" value="Information System" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Software Engineering" value="Software Engineering" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Data Science" value="Data Science" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Game Development" value="Game Development" style={{ fontSize: 14, color: '#212529' }} />
            </Picker>
            </View>
            {presSpecializationError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid specialization</Text>
            </View>
          )}
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Presentation Venue:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              value={presVenue}
              onChangeText={handlePresVenueChange}
              placeholder="Enter Presentation Venue"
            />
          </View>
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Presentation Date:</Text>
          <View style={styles.inputContainer}>
            {presDate ? (
              <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
                <Text style={[styles.dateButtonText, presDate ? { color: '#212529' } : { color: 'grey' }]}>
                  {presDate ? presDate.toDateString() : 'Choose Date'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Choose Date</Text>
                <Ionicons name="calendar-sharp" size={20} color="grey" style={styles.icon} />
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={presDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                onCancel={handleCancelDatePicker}
              />
            )}
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Presentation Time:</Text>
          <View style={styles.inputContainer}>
            {presTime ? (
              <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
                <Text style={[styles.dateButtonText, presTime ? { color: '#212529' } : { color: 'grey' }]}>
                  {presTime ? presTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Choose Time'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Choose Time</Text>
                <Ionicons name="time" size={20} color="grey" style={styles.icon} />
              </TouchableOpacity>
            )}
            {showTimePicker && (
              <DateTimePicker
                value={presTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                onCancel={handleCancelTimePicker}
              />
            )}
          </View>
        </View>

        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#243DB7', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 80 }}
            onPress={handleSubmit}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Create Presentation</Text>
          </TouchableOpacity>
        </View>

        <Modal isVisible={isModalVisible} backdropColor="#000" backdropOpacity={0.5}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleModalButtonPress}>
              <Text style={styles.modalButtonText}>{modalButtonText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: '#212529',
  },
  inputContainer: {
    height: 55,
    backgroundColor: '#F4F5FF',
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  pickerContainer: {
    height: 55,
    backgroundColor: '#F4F5FF',
    paddingHorizontal: 0,
    borderWidth: 0.5,
    paddingVertical: 1,
  },
  dateButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 3,
  },
  dateButtonText: {
    color: 'grey',
    fontSize: 14,
    textAlign: 'left',
  },
  icon: {
    marginLeft: 242,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#243DB7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

function FMPresScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
          tabBarLabelStyle: {
            fontSize: 13,
            textTransform: 'none',
          },
          tabBarstyle: {
            backgroundColor: '#f2f2f2',
          },
          tabBarindicatorStyle: {
            backgroundColor: '#0038FF',
          },
        }}
      >
        <Tab.Screen name="Create Presentation" component={Pres_CreateScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function FMCreatePresScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#243DB7',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'normal',
        },
      }}
    >
      <Stack.Screen name="Presentation" component={FMPresScreen} />
    </Stack.Navigator>
  );
}
