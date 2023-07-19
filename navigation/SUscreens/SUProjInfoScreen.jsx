import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker'; // Import the document picker library
import Modal from 'react-native-modal';
import fs from 'react-native-fs';
import { decode } from 'base64-arraybuffer';

import { AuthContext } from '../../AuthContext';

import AWS from 'aws-sdk';

const SUProjInfoScreen = ({ route, navigation }) => {
  const { project } = route.params; // Get the selected project from the navigation route
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
    }
  
    // Close the modal
    setModalVisible(false);
  };

  const [numOfStudents, setNumOfStudents] = useState(project.numofstudents);  
  const [projectUpload, setProjectUpload] = useState([]);
  const [projectUpload1, setProjectUpload1] = useState([]);
  const [projectUpload2, setProjectUpload2] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Project',
      headerStyle: {
        backgroundColor: '#243DB7', // Customize the header background color
      },
      headerTitleStyle: {
        fontWeight: 'normal',
      },
      headerTintColor: '#fff', // Customize the header text color
    });
  }, []);

  const handleAssignStudent = () => {
    if (project.numofstudents === 2) {
      navigation.navigate('SUStuAssign2Screen', { project });
    } else {
      navigation.navigate('SUStuAssignScreen', { project });
    }
  };

  const handleProjectUpload = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setProjectUpload(file);
    } catch (error) {
      console.error('Error selecting file:', error);
      // Handle any error logic here
      return;
    }
  };

  const handleProjectUpload1 = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setProjectUpload1(file);
    } catch (error) {
      console.error('Error selecting file:', error);
      // Handle any error logic here
      return;
    }
  };

  const handleProjectUpload2 = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setProjectUpload2(file);
    } catch (error) {
      console.error('Error selecting file:', error);
      // Handle any error logic here
      return;
    }
  };
  
  const uploadProjectToS3 = async () => {
    if (projectUpload) {
      let uploadedFileUrl = '';
      let fileKey = '';
  
      // AWS S3 configuration
      AWS.config.update({
        accessKeyId: 'AKIAYXUWH6ITHZDQZQNJ',
        secretAccessKey: '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',
        region: 'ap-southeast-2',
      });
  
      const base64 = await fs.readFile(projectUpload[0].uri, 'base64');
      const arrayBuffer = decode(base64);  
      const s3 = new AWS.S3();
      fileKey = `${user.accid}_${projectUpload[0].name}`;
  
      // Configure the parameters for the S3 upload
      const params = {
        Bucket: 'fyp-uploads',
        Key: fileKey,
        Body: arrayBuffer,
        ContentType: projectUpload[0].type,
        ContentDisposition: 'attachment',
      };
  
      // Upload the file to the S3 bucket
      try {
        const result = await s3.upload(params).promise();
        const expirationTime = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
        uploadedFileUrl = s3.getSignedUrl('getObject', { Bucket: 'fyp-uploads', Key: fileKey, Expires: expirationTime });
  
        const response = await fetch('http://3.26.23.172/update_project_report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.projid,
            projectUpload: { fileName: projectUpload[0].name, fileUrl: uploadedFileUrl, bucket: 'fyp-uploads', key: fileKey },
          }),
        });
  
        if (response.ok) {
          setModalTitle('Success!');
          setModalMessage('Project Report Uploaded');
          setModalButtonText('OK');
          setModalVisible(true);
        } else {
          console.error('Error uploading report:', response.statusText);
          // Handle any error logic here
        }
      } catch (error) {
        console.error('Error uploading report:', error);
        // Handle any error logic here
      }
    }
  };
  
  useEffect(() => {
    uploadProjectToS3();
  }, [projectUpload]);
  
  const uploadProject1ToS3 = async () => {
    if (projectUpload1) {
      let uploadedFileUrl = '';
      let fileKey = '';
  
      // AWS S3 configuration
      AWS.config.update({
        accessKeyId: 'AKIAYXUWH6ITHZDQZQNJ',
        secretAccessKey: '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',
        region: 'ap-southeast-2',
      });
  
      const base64 = await fs.readFile(projectUpload1[0].uri, 'base64');
      const arrayBuffer = decode(base64);  
      const s3 = new AWS.S3();
      fileKey = `${user.accid}_${projectUpload1[0].name}`;

      // Configure the parameters for the S3 upload
      const params = {
        Bucket: 'fyp-uploads',
        Key: fileKey,
        Body: arrayBuffer,
        ContentType: projectUpload1[0].type,
        ContentDisposition: 'attachment',
      };
  
      // Upload the file to the S3 bucket
      try {
        const result = await s3.upload(params).promise();
        const expirationTime = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
        uploadedFileUrl = s3.getSignedUrl('getObject', { Bucket: 'fyp-uploads', Key: fileKey, Expires: expirationTime });
  
        const response = await fetch('http://3.26.23.172/update_project_report1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.projid,
            projectUpload1: { fileName: projectUpload1[0].name, fileUrl: uploadedFileUrl, bucket: 'fyp-uploads', key: fileKey },
          }),
        });
  
        if (response.ok) {
          setModalTitle('Success!');
          setModalMessage('Project Report Uploaded');
          setModalButtonText('OK');
          setModalVisible(true);
        } else {
          console.error('Error uploading report:', response.statusText);
          // Handle any error logic here
        }
      } catch (error) {
        console.error('Error uploading report:', error);
        // Handle any error logic here
      }
    }
  };

  useEffect(() => {
    uploadProject1ToS3();
  }, [projectUpload1]);

  const uploadProject2ToS3 = async () => {
    if (projectUpload2) {
      let uploadedFileUrl = '';
      let fileKey = '';
  
      // AWS S3 configuration
      AWS.config.update({
        accessKeyId: 'AKIAYXUWH6ITHZDQZQNJ',
        secretAccessKey: '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',
        region: 'ap-southeast-2',
      });
  
      const base64 = await fs.readFile(projectUpload2[0].uri, 'base64');
      const arrayBuffer = decode(base64);  
      const s3 = new AWS.S3();
      fileKey = `${user.accid}_${projectUpload2[0].name}`;
  
      // Configure the parameters for the S3 upload
      const params = {
        Bucket: 'fyp-uploads',
        Key: fileKey,
        Body: arrayBuffer,
        ContentType: projectUpload2[0].type,
        ContentDisposition: 'attachment',
      };
  
      // Upload the file to the S3 bucket
      try {
        const result = await s3.upload(params).promise();
        const expirationTime = 10 * 365 * 24 * 60 * 60; // 10 years in seconds
        uploadedFileUrl = s3.getSignedUrl('getObject', { Bucket: 'fyp-uploads', Key: fileKey, Expires: expirationTime });
  
        const response = await fetch('http://3.26.23.172/update_project_report2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.projid,
            projectUpload2: { fileName: projectUpload2[0].name, fileUrl: uploadedFileUrl, bucket: 'fyp-uploads', key: fileKey },
          }),
        });
  
        if (response.ok) {
          setModalTitle('Success!');
          setModalMessage('Project Report Uploaded');
          setModalButtonText('OK');
          setModalVisible(true);
        } else {
          console.error('Error uploading report:', response.statusText);
          // Handle any error logic here
        }
      } catch (error) {
        console.error('Error uploading report:', error);
        // Handle any error logic here
      }
    }
  };
  
  useEffect(() => {
    uploadProject2ToS3();
  }, [projectUpload2]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Project ID: {project.projid}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center', marginBottom: 20, }}>Project Information</Text>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Title:</Text>
            <Text style={styles.text}>{project.projecttitle}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Proposed By:</Text>
            <Text style={styles.text}>{project.projectpostedby}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Type:</Text>
            <Text style={styles.text}>{project.projecttype}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Specialization:</Text>
            <Text style={styles.text}>{project.projectspecialization}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Focus:</Text>
            <Text style={styles.text}>{project.projectfocus}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Description:</Text>
            <Text style={styles.text}>{project.projectdescription}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Objectives:</Text>
            <Text style={styles.text}>{project.projectobjectives}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Project Scope:</Text>
            <Text style={styles.text}>{project.projectscope}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Number of Students:</Text>
            <Text style={styles.text}>{project.numofstudents}</Text>
            </View>
            
            {project.numofstudents === 2 && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 1 Subtitle:</Text>
            <Text style={styles.text}>{project.studentonesub}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 1 Work Distribution:</Text>
            <Text style={styles.text}>{project.studentonework}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 2 Subtitle:</Text>
            <Text style={styles.text}>{project.studenttwosub}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 2 Work Distribution:</Text>
            <Text style={styles.text}>{project.studenttwowork}</Text>
            </View>
            </>
            )}

            <View style={styles.infoContainer}>
            <Text style={styles.label}>Industry Collaboration:</Text>
            <Text style={styles.text}>{project.industrycollab}</Text>
            </View>
            
            {project.industrycollab === 'Yes' && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Company:</Text>
            <Text style={styles.text}>{project.industrycompany}</Text>
            </View>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Company Contact No.:</Text>
            <Text style={styles.text}>{project.industrycontact}</Text>
            </View>
            </>
            )}

            {project.numofstudents === 1 && project.studentassigned === 'Assigned' && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student Assigned:</Text>
            <Text style={styles.text}>{project.student[0].name} | {project.student[0].email}</Text>
            </View>
            </>
            )}

            {project.numofstudents === 2 && project.studentassigned === 'Assigned' && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 1 Assigned:</Text>
            <Text style={styles.text}>{project.student[0].name} | {project.student[0].email}</Text>
            </View>
            </>
            )}

            {project.numofstudents === 2 && project.studentassigned === 'Assigned' && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Student 2 Assigned:</Text>
            <Text style={styles.text}>{project.student[1].name} | {project.student[1].email}</Text>
            </View>
            </>
            )}

            {project.moderatorassigned === 'Assigned' && (
            <>
            <View style={styles.infoContainer}>
            <Text style={styles.label}>Moderator Assigned:</Text>
            <Text style={styles.text}>{project.moderator_name}</Text>
            </View>
            </>
            )}

        {/* Assign Student Button */}
        {project.projectstatus === 'Accepted' && project.studentassigned !== 'Assigned' && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleAssignStudent}
          >
            <Text style={styles.buttonText}>
              {project.numOfStudents === '1' ? 'Assign Students' : 'Assign Student'}
              </Text>
          </TouchableOpacity>
        </View>
        )}

        {/* Project Upload Button */}
        {project.projectstatus === 'Accepted' && project.studentassigned === 'Assigned' && project.moderatorassigned === 'Assigned' && project.numofstudents === 1 && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleProjectUpload}
          >
            <Text style={styles.buttonText}>Upload Student Report </Text>
          </TouchableOpacity>
          {project.projectupload && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{project.projectupload.fileName}</Text>
          )}
        </View>
        )}

        {/* Project Upload 1 Button */}
        {project.projectstatus === 'Accepted' && project.studentassigned === 'Assigned' && project.moderatorassigned === 'Assigned' && project.numofstudents === 2 && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleProjectUpload1}
          >
            <Text style={styles.buttonText}>Upload Student 1 Report</Text>
          </TouchableOpacity>
          {project.projectupload1 && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{project.projectupload1.fileName}</Text>
          )}
        </View>
        )}

        {/* Project Upload 2 Button */}
        {project.projectstatus === 'Accepted' && project.studentassigned === 'Assigned' && project.moderatorassigned === 'Assigned' && project.numofstudents === 2 &&  (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleProjectUpload2}
          >
            <Text style={styles.buttonText}>Upload Student 2 Report</Text>
          </TouchableOpacity>
          {project.projectupload2 && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{project.projectupload2.fileName}</Text>
          )}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: '#212529',
  },
  text: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#343a40',
    paddingHorizontal: 10,
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
  spacing: {
    marginTop:20,
  },
  button: {
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 80,
  },
  stuButton: {
    backgroundColor: '#243DB7', // Modified background color for reject button
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
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

export default SUProjInfoScreen;
