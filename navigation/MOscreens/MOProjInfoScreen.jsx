import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking  } from 'react-native';
import Modal from 'react-native-modal';

const MOProjInfoScreen = ({ route, navigation }) => {
  const { project } = route.params; // Get the selected project from the navigation route
  
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

  const handleDownloadStudent = () => {
    if (project.projectupload && project.projectupload.fileUrl) {
      Linking.openURL(project.projectupload.fileUrl);
    } else {
    setModalTitle('File Not Available.');
    setModalMessage('The student report is not available for download. Check back later.');
    setModalButtonText('OK');
    setModalVisible(true);
    }
  };

  const handleDownloadStudent1 = () => {
    if (project.projectupload1 && project.projectupload1.fileUrl) {
      Linking.openURL(project.projectupload1.fileUrl);
    } else {
    setModalTitle('File Not Available.');
    setModalMessage('The student report is not available for download. Check back later.');
    setModalButtonText('OK');
    setModalVisible(true);
    }
  };

  const handleDownloadStudent2 = () => {
    if (project.projectupload2 && project.projectupload2.fileUrl) {
      Linking.openURL(project.projectupload2.fileUrl);
    } else {
    setModalTitle('File Not Available.');
    setModalMessage('The student report is not available for download. Check back later.');
    setModalButtonText('OK');
    setModalVisible(true);
    }
  };

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

        {/* Download Student Report */}
        {project.numofstudents === 1 && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleDownloadStudent}
          >
            <Text style={styles.buttonText}>Download Student Report</Text>
          </TouchableOpacity>
          {project.projectupload && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{project.projectupload.fileName}</Text>
          )}
        </View>
        )}

        {/* Download Student Report */}
        {project.numofstudents === 2 && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleDownloadStudent1}
          >
            <Text style={styles.buttonText}>Download Student 1 Report</Text>
          </TouchableOpacity>
          {project.projectupload1 && (
          <Text style={{ textAlign: 'center', fontSize: 14, color: '#212529' }}>{project.projectupload1.fileName}</Text>
          )}
        </View>
        )}

        {/* Download Student Report */}
        {project.numofstudents === 2 && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity
            style={[styles.button, styles.stuButton]}
            onPress={handleDownloadStudent2}
          >
            <Text style={styles.buttonText}>Download Student 2 Report</Text>
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

export default MOProjInfoScreen;
