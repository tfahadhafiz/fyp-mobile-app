import React, { useState, useContext } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView
} from 'react-native';
import Gradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import { AuthContext } from './AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const handleModalButtonPress = () => {
    if (modalButtonText === 'Try again') {
      setModalVisible(false);
    } else if (modalButtonText === 'OK') {
      setModalVisible(false);
    }
  
    // Close the modal
    setModalVisible(false);
  };

  const [staffID, setStaffID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const requestBody = {
      email: staffID,
      password: password
    };

    fetch('http://3.26.23.172/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(data => {
        const { status, data: userData } = data;
        if (status) {
          login(userData); // Store user data in the context
          const account_type = userData.account_type;
          // Navigate based on the account type
          if (account_type === 'supervisor') {
            navigation.navigate('SUAnnScreen');
          } else if (account_type === 'faculty_manager') {
            navigation.navigate('FMAnnScreen');
          } else if (account_type === 'coordinator') {
            navigation.navigate('COAnnScreen');
          } else if (account_type === 'moderator') {
            navigation.navigate('MOAnnScreen');
          } else {
            Alert.alert('Invalid account type');
          }
        } else {
          setModalTitle('Invalid Login!');
          setModalMessage('The email and password you entered did not match our records. Please double-check and try again.');
          setModalButtonText('Try again');
          setModalVisible(true);
        }
      })
      .catch(error => {
        setModalTitle('Error');
        setModalMessage('Login failed. Something went wrong on our end.');
        setModalButtonText('Try again');
        setModalVisible(true);
        console.error(error);
      });
  };

  return (
    <Gradient colors={['#3252F7', '#F3B950']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor="#3252F7"
          barStyle="light-content"
        />
        <View style={styles.centeredContainer}>
          <Image source={require('./assets/fyphome.png')}  
          style={{ width: 300, height: 180, resizeMode: 'contain' }}/>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={staffID}
            onChangeText={text => setStaffID(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              I forgot my password
            </Text>
          </TouchableOpacity>

          <Modal isVisible={isModalVisible} backdropColor="#000" backdropOpacity={0.5}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleModalButtonPress}>
              <Text style={styles.modalButtonText}>{modalButtonText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        </View>
      </SafeAreaView>
    </Gradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  centeredContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  loginButton: {
    width: '35%',
    height: 40,
    backgroundColor: '#FFD800',
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButtonText: {
    color: 'black',
    fontWeight: 'bold'
  },
  forgotPassword: {
    marginTop: 20,
    alignItems: 'center'
  },
  forgotPasswordText: {
    color: 'black',
    textDecorationLine: 'underline'
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
