import React, { useState, useRef, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import DocumentPicker from 'react-native-document-picker'; // Import the document picker library
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';

import { AuthContext } from '../../AuthContext';

import AWS from 'aws-sdk';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function Ann_CreateScreen({navigation}) {
  const { user } = useContext(AuthContext);
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const handleModalButtonPress = () => {
    if (modalButtonText === 'Try again') {
      setModalVisible(false);
    } else if (modalButtonText === 'OK') {
      setModalVisible(false);
      navigation.navigate('FMAnnScreen');
    }
  
    // Close the modal
    setModalVisible(false);
  };
  
  const [annTitle, setAnnTitle] = useState('');
  const [annDescription, setAnnDescription] = useState('');
  const [upload, setUpload] = useState([]);
  const descriptionInputRef = useRef(null);
  const [isTitleSelected, setIsTitleSelected] = useState(false);
  const [isDescriptionSelected, setIsDescriptionSelected] = useState(false);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);

  const handleAnnTitle = (text) => {
    setAnnTitle(text);
  };

  const handleAnnDescription = (text) => {
    setAnnDescription(text);
  };

  const handleTitleFocus = () => {
    setIsTitleSelected(true);
  };

  const handleDescriptionFocus = () => {
    setIsDescriptionSelected(true);
  };

  const handleTitleBlur = () => {
    setIsTitleSelected(false);
    setIsTitleEmpty(annTitle === '');
  };

  const handleDescriptionBlur = () => {
    setIsDescriptionSelected(false);
    setIsDescriptionEmpty(annDescription === '');
  };

  const handleUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles], // Allow picking all types of files
      });
      setUpload(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearUpload = () => {
    setUpload([]);
  };

  const handleSubmit = async () => {
    try {
      if (!annTitle || !annDescription) {
        setModalTitle('Error');
        setModalMessage('Please ensure that you fill in all the required fields');
        setModalButtonText('Try again');
        setModalVisible(true);
        return;
      }

      // If a file is selected, upload it to S3 bucket
      let uploadedFileUrl = '';
      let fileKey = '';
      if (upload.length > 0) {
        // AWS S3 configuration
        AWS.config.update({
          accessKeyId: 'AKIAYXUWH6ITHZDQZQNJ',
          secretAccessKey: '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',
          region: 'ap-southeast-2',
        });

        const base64 = await fs.readFile(upload[0].uri, 'base64');
        const arrayBuffer = decode(base64);
        const s3 = new AWS.S3();
        fileKey = `${user.accid}_${upload[0].name}`;

        // Configure the parameters for the S3 upload
        const params = {
          Bucket: 'fyp-uploads',
          Key: fileKey,
          Body: arrayBuffer,
          ContentType : upload[0].type,
          ContentDisposition: 'attachment', 
        };

        // Upload the file to the S3 bucket
        const result = await s3.upload(params).promise();
        const expirationTime = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
        uploadedFileUrl = s3.getSignedUrl('getObject', {Bucket: 'fyp-uploads', Key: fileKey, Expires: expirationTime });
      }

      const response = await fetch('http://3.26.23.172/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annTitle,
          annDescription,
          upload: upload.length > 0 ? [{ fileName: upload[0].name, fileUrl: uploadedFileUrl, bucket: 'fyp-uploads', key: fileKey }] : [],
          annPostedBy: user.name,
        }),
      });

      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Announcement created');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        console.error('Error creating announcement:', response.statusText);
        // Handle any error logic here
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      // Handle any error logic here
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20 }}>
        <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center' }}>Enter Announcement Details</Text>
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Title:</Text>
          <View
            style={[
              styles.inputContainer,
              (!isTitleSelected && isTitleEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={handleAnnTitle}
              onFocus={handleTitleFocus}
              onBlur={handleTitleBlur}
              value={annTitle}
              placeholder="Enter Announcement Title"
              placeholderTextColor="grey"
            />
          </View>
          {!isTitleSelected && isTitleEmpty && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please enter announcement title</Text>
            </View>
          )}
        </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Description:</Text>
          <View
            style={[
              styles.inputBigContainer,
              (!isDescriptionSelected && isDescriptionEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              ref={descriptionInputRef}
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={handleAnnDescription}
              onFocus={handleDescriptionFocus}
              onBlur={handleDescriptionBlur}
              value={annDescription}
              placeholder="Enter Announcement Description"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={22}
            />
          </View>
          {!isDescriptionSelected && isDescriptionEmpty && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
            <Text style={styles.errorText}>Please enter announcement description</Text>
          </View>
        )}
      </View>

        <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Attachment (if any):</Text>
          <TouchableOpacity
            style={styles.fileUploadButton}
            onPress={handleUpload} // Open the file picker on button press
          >
            <Text style={styles.fileUploadButtonText}>Choose File</Text>
            <Ionicons name="document-sharp" size={20} color="grey" style={styles.icon} />
          </TouchableOpacity>
          {upload.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 8 }}>
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{upload[0].name}</Text>
            <TouchableOpacity onPress={handleClearUpload}>
              <Ionicons name="trash-outline" size={18} color="#343a40" style={{ marginLeft: 10 }}/>
            </TouchableOpacity>
          </View>
        )}
      </View>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#243DB7', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 80, marginTop: 20 }}
            onPress={handleSubmit}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Create Announcement</Text>
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
  inputBigContainer: {
    backgroundColor: '#F4F5FF',
    paddingHorizontal: 12,
    borderWidth: 0.5,
  },
  fileUploadButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    marginTop: 4,
    backgroundColor: '#F4F5FF',
    borderWidth: 0.5,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  fileUploadButtonText: {
    color: 'grey',
    fontSize: 14,
    textAlign: 'left',
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
  icon: {
    marginLeft: 242,
  },
});

function FMAnnScreen({ navigation }) {
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
        <Tab.Screen name="Create Announcement" component={Ann_CreateScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function FMCreateAnnScreen() {
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
      <Stack.Screen name="Announcement" component={FMAnnScreen} />
    </Stack.Navigator>
  );
}