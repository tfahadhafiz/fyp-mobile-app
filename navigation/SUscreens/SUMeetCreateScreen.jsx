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

function Meet_CreateScreen({navigation}) {

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

  const [fetchedProjects, setFetchedProjects] = useState([]);
  const [projId, setProjId] = useState('');
  const [fetchedStudents, setFetchedStudents] = useState([]);
  const [stuId, setStuId] = useState('');
  const [meetDate, setMeetDate] = useState(null);
  const [meetTime, setMeetTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [projIdError, setProjIdError] = useState(false);
  const [stuIdError, setStuIdError] = useState(false);

  const { user } = useContext(AuthContext); // Access authState from AuthContext

  useEffect(() => {
    fetch('http://3.26.23.172/projects')
      .then((response) => response.json())
      .then((data) => {
        const filteredProjects = data.filter(
          (project) => project.projectstatus === 'Accepted' && project.studentassigned === 'Assigned' && project.supervisor_id === user?.accid
        );
        setFetchedProjects(filteredProjects);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });

      fetch('http://3.26.23.172/students')
      .then((response) => response.json())
      .then((data) => {
        const filteredStudents = data.filter(
          (student) => student.projid === projId
        );
        setFetchedStudents(filteredStudents);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, [projId]);

  const handleStuIdChange = (value) => {
    setStuId(value);
    if (value === '') {
      setStuIdError(true);
    } else {
      setStuIdError(false);
    }
  };

  const handleProjIdChange = (value) => {
    setProjId(value);
    if (value === '') {
      setProjIdError(true);
    } else {
      setProjIdError(false);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setMeetDate(date);
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setMeetTime(time);
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
    const formattedDate = meetDate ? format(meetDate, 'yyyy-MM-dd') : null;
    const formattedTime = meetTime ? format(meetTime, 'HH:mm:ss') : null;
    try {
      if (!projId || !stuId || !meetDate || !meetTime) {
        setModalTitle('Error');
        setModalMessage('Please ensure that you select all the required fields');
        setModalButtonText('Try again');
        setModalVisible(true);
        return;
      }

      const supervisorId = user?.accid; // Get the accId from the authState
  
      const response = await fetch('http://3.26.23.172/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projId,
          stuId,
          meetDate: formattedDate,
          meetTime: formattedTime,
          supervisorId,
        }),
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Meeting created');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        console.error('Error creating meeting:', response.statusText);
        // Handle any error logic here
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      // Handle any error logic here
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20 }}>
        <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center' }}>
          Enter Your Meeting Details
        </Text>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Project:</Text>
          <View style={[styles.pickerContainer, projIdError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
          <Picker selectedValue={projId} onValueChange={handleProjIdChange}>
            <Picker.Item label="Select Project" value="" style={{ fontSize: 14, color: 'grey' }} />
            {fetchedProjects.map((project) => (
              <Picker.Item
                key={project.projid}
                label={project.projecttitle}
                value={project.projid}
                style={{ fontSize: 14 }}
              />
            ))}
          </Picker>
          </View>
          {projIdError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a project</Text>
            </View>
          )}
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Student:</Text>
          <View style={[styles.pickerContainer, stuIdError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
          <Picker selectedValue={stuId} onValueChange={handleStuIdChange}>
            <Picker.Item label="Select Student" value="" style={{ fontSize: 14, color: 'grey' }} />
            {fetchedStudents.map((student) => (
              <Picker.Item
                key={student.stuid}
                label={student.name}
                value={student.stuid}
                style={{ fontSize: 14 }}
              />
            ))}
          </Picker>
          </View>
          {stuIdError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a student</Text>
            </View>
          )}
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Meeting Date:</Text>
          <View style={styles.inputContainer}>
            {meetDate ? (
              <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
                <Text style={[styles.dateButtonText, meetDate ? { color: '#212529' } : { color: 'grey' }]}>
                  {meetDate ? meetDate.toDateString() : 'Choose Date'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={showDatePickerModal} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Choose Date</Text>
                <Ionicons name="calendar-sharp" size={20} color="grey" style={styles.icon}/>
              </TouchableOpacity>
            )}
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={meetDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              onCancel={handleCancelDatePicker}
            />
          )}
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Meeting Time:</Text>
          <View style={styles.inputContainer}>
            {meetTime ? (
              <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
                <Text style={[styles.dateButtonText, meetTime ? { color: '#212529' } : { color: 'grey' }]}>
                {meetTime ? meetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Choose Time'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={showTimePickerModal} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>Choose Time</Text>
                <Ionicons name="time-sharp" size={20} color="grey" style={styles.icon}/>
              </TouchableOpacity>
            )}
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={meetTime || new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
              onCancel={handleCancelTimePicker}
            />
          )}
        </View>

        <View style={{ alignItems: 'center', marginTop: 20}}>
          <TouchableOpacity
            style={{ backgroundColor: '#243DB7', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 80, marginTop: 20 }}
            onPress={handleSubmit}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Create Meeting</Text>
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
    marginVertical: 1,
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

function SUMeetScreen({ navigation }) {
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
        <Tab.Screen name="Create a Meeting" component={Meet_CreateScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function SUCreateMeetScreen() {
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
      <Stack.Screen name="Meeting" component={SUMeetScreen} />
    </Stack.Navigator>
  );
}
