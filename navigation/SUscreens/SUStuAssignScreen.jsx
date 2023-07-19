import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';

const SUStuAssignScreen = ({ route, navigation }) => {
  const { project } = route.params;
  
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

  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Project Information',
      headerStyle: {
        backgroundColor: '#243DB7',
      },
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTintColor: '#fff',
    });
  }, []);

  const handleSubmit = async () => {
    try {
      if (!studentName || !studentId || !studentEmail) {
        setModalTitle('Error');
        setModalMessage('Please ensure that you fill in all the required fields');
        setModalButtonText('Try again');
        setModalVisible(true);
        return;
      }
      const response = await fetch('http://3.26.23.172/assign_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projId: project.projid, // Add the project ID to the request body
          students: [
            {
              name: studentName,
              id: studentId,
              email: studentEmail,
            }
          ],
        }),
      });

      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Student assigned');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        // Handle the error if the update was not successful
        console.error('Failed to assign student');
        alert('Failed to assign student'); // Display error message
      }
    } catch (error) {
      console.error('Error assigning student:', error);
      alert('An error occurred while assigning student'); // Display error message
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Project ID: {project.projid}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subtitle}>Assign Student</Text>
        <View style={styles.infoContainer}>
          <Text style={[styles.label, styles.spacing]}>Student Name:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={text => setStudentName(text)}
              value={studentName}
              placeholder="Enter Student Name"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={[styles.label]}>Student ID:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={text => setStudentId(text)}
              value={studentId}
              placeholder="Enter Student ID"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={[styles.label]}>Student Email:</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={text => setStudentEmail(text)}
              value={studentEmail}
              placeholder="Enter Student Email"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
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
};

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
  subtitle: {
    color: 'grey',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 8,
  },
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
  spacing: {
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#243DB7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#243DB7',
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

export default SUStuAssignScreen;
