import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

export default function SUMeetWeekInputScreen({ route, navigation }) {
  const { week, meetId, studentName } = route.params; // Get the selected week from the navigation route

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

  const [initialMeetingMode, setInitialMeetingMode] = useState('');
  const [initialWorkDone, setInitialWorkDone] = useState('');
  const [initialWorkToBeDone, setInitialWorkToBeDone] = useState('');
  const [initialComments, setInitialComments] = useState('');  
  const [meetingMode, setMeetingMode] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [workToBeDone, setWorkToBeDone] = useState('');
  const [comments, setComments] = useState('');
  const [meetStatus, setMeetStatus] = useState('');

  const handleMeetingModeChange = (value) => {
    setMeetingMode(value);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Meeting',
      headerStyle: {
        backgroundColor: '#243DB7', // Customize the header background color
      },
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTintColor: '#fff', // Customize the header text color
    });

    // Fetch the initial data for the selected meeting
    fetch(`http://3.26.23.172/meeting_details/${meetId}/${week}`)
      .then(response => response.json())
      .then(data => {
        // Populate the state variables with the fetched data
        setInitialMeetingMode(data.meetingmode);
        setInitialWorkDone(data.workdone);
        setInitialWorkToBeDone(data.worktobedone);
        setInitialComments(data.comments);
        setMeetStatus(data.meetstatus); // Add this line to set the meetStatus state
      })
      .catch(error => {
        console.error('Error fetching meeting details:', error);
      });
  }, []);

  // Function to handle saving the input for the current week
  function handleSaveInput() {
    if (!meetingMode || !workDone || !workToBeDone || !comments) {
      setModalTitle('Error');
      setModalMessage('Please ensure that you fill in and select all the required fields');
      setModalButtonText('Try again');
      setModalVisible(true);
      return;
    }
    // Create an object with the input values
    const meetingDetails = {
      week: week,
      meetId: meetId,
      meetingMode: meetingMode,
      workDone: workDone,
      workToBeDone: workToBeDone,
      comments: comments
    };
    // Make a POST request to the API endpoint
    fetch('http://3.26.23.172/meeting_details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meetingDetails)
    })
    .then(response => {
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Meeting details updated');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        console.error('Error saving meeting details');
      }
    })
    .catch(error => {
      console.error('Error saving meeting details:', error);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Student: {studentName}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center', marginBottom: 20 }}>Meeting Week {week}</Text>
        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Meeting Mode:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={meetingMode || initialMeetingMode}
              onValueChange={handleMeetingModeChange}
              enabled={meetStatus !== 'Done'} // Disable if meetStatus is 'Done'
            >
              <Picker.Item label="Select Meeting Mode" value="" style={{ fontSize: 14, color: 'grey' }} />
              <Picker.Item label="Face To Face" value="Face To Face" style={{ fontSize: 14, color: '#212529' }} />
              <Picker.Item label="Online" value="Online" style={{ fontSize: 14, color: '#212529' }} />
            </Picker>
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Work Done:</Text>
          <View style={styles.inputMediumContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={setWorkDone}
              value={workDone || initialWorkDone}
              placeholder="Enter Work Done"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={12}
              editable={meetStatus !== 'Done'} // Disable if meetStatus is 'Done'
            />
          </View>
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Work To Be Done:</Text>
          <View style={styles.inputMediumContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={setWorkToBeDone}
              value={workToBeDone || initialWorkToBeDone}
              placeholder="Enter Work To Be Done"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={12}
              editable={meetStatus !== 'Done'} // Disable if meetStatus is 'Done'
            />
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Comments:</Text>
          <View style={styles.inputMediumContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={setComments}
              value={comments || initialComments}
              placeholder="Enter Comments"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={12}
              editable={meetStatus !== 'Done'} // Disable if meetStatus is 'Done'
            />
          </View>
        </View>

        {meetStatus !== 'Done' && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#243DB7', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 80, marginTop: 20 }}
            onPress={handleSaveInput}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Save</Text>
          </TouchableOpacity>
        </View>
        )}

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
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 2,
    paddingHorizontal: 20,
  },
  topBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#0038FF',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  topBarText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputMediumContainer: {
    height: 220,
    backgroundColor: '#F4F5FF',
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderWidth: 0.5,
    paddingVertical: 6,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: '#212529',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: '#000',
    height: 100,
  },
  pickerContainer: {
    height: 55,
    backgroundColor: '#F4F5FF',
    paddingHorizontal: 0,
    borderWidth: 0.5,
    paddingVertical: 1,
  },
  button: {
    backgroundColor: '#243DB7',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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