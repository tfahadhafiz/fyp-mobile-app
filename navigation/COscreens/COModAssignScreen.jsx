import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const COModAssignScreen = ({ route, navigation }) => {
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

  const [fetchedAccounts, setFetchedAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

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

    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://3.26.23.172/view_users');
      const data = await response.json();
      setFetchedAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const handleAccountChange = (itemValue) => {
    setSelectedAccount(itemValue);
  };

  const handleSubmit = async () => {
      try {
        if (!selectedAccount) {
          setModalTitle('Error');
          setModalMessage('Please ensure that you select a moderator');
          setModalButtonText('Try again');
          setModalVisible(true);
          return;
        }
        const response = await fetch('http://3.26.23.172/update_project_moderator', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.projid,
            accountId: selectedAccount.accid,
            accountName: selectedAccount.name,
          }),
        });
  
        if (response.ok) {
            // Update successful
            setModalTitle('Success!');
            setModalMessage('Moderator assigned');
            setModalButtonText('OK');
            setModalVisible(true);
          } else {
            // Handle the error if the update was not successful
            console.error('Failed to assign moderator');
            setModalTitle('Error');
            setModalMessage('Please ensure that you select a moderator');
            setModalButtonText('Try again');
            setModalVisible(true);
          }
        } catch (error) {
          console.error('Error assigning moderator:', error);
          alert('An error occurred while assigning moderator'); // Display error message
        }
    };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Project ID: {project.projid}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.subtitle}>Assign Moderator</Text>
        <View style={styles.infoContainer}>
          <Text style={[styles.label, styles.spacing]}>Moderator:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAccount}
              onValueChange={handleAccountChange}
            >
              <Picker.Item label="Select Account" value={null} style={styles.pickerItem} />
              {fetchedAccounts.filter((account) => account.account_type === "moderator").map((account) => (
                <Picker.Item
                key={account.accid}
                label={account.name}
                value={account}
                style={styles.pickerItem}
                />
            ))}
            </Picker>
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
    color: 'black',
  },
  spacing: {
    marginTop: 20,
  },
  pickerContainer: {
    height: 55,
    backgroundColor: '#F4F5FF',
    paddingHorizontal: 0,
    borderWidth: 0.5,
  },
  pickerItem: {
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#243DB7',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export default COModAssignScreen;
