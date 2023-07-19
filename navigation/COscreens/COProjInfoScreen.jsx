import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';

const COProjInfoScreen = ({ route, navigation }) => {
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
      navigation.goBack();
    }
  
    // Close the modal
    setModalVisible(false);
  };
  
  const [projectStatus, setProjectStatus] = useState(project.projectstatus);
  const [studentAssigned, setStudentAssigned] = useState(project.studentassigned);
  const [moderatorAssigned, setModeratorAssigned] = useState(project.moderatorassigned);

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

  const handleAccept = async () => {
    try {
      const response = await fetch('http://3.26.23.172/update_project_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.projid,
          status: 'Accepted',
        }),
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Project accepted');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        // Handle the error if the update was not successful
        console.error('Failed to accept project');
        alert('Failed to accept project');
      }
    } catch (error) {
      console.error('Error accepting project:', error);
      alert('An error occurred while accepting project');
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch('http://3.26.23.172/update_project_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.projid,
          status: 'Declined',
        }),
      });
  
      if (response.ok) {
        // Update successful
        setModalTitle('Success!');
        setModalMessage('Project rejected');
        setModalButtonText('OK');
        setModalVisible(true);
      } else {
        // Handle the error if the update was not successful
        console.error('Failed to reject project');
        alert('Failed to reject project');
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      alert('An error occurred while rejecting project');
    }
  };

  const handleAssignModerator = () => {
    navigation.navigate('COModAssignScreen', { project });
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

        {/* Accept and Reject Buttons */}
        {projectStatus === 'Pending' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Assign/Reassign Moderator Button */}
        {projectStatus === 'Accepted' && studentAssigned === 'Assigned' && (
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              style={[styles.button2, styles.modButton]}
              onPress={handleAssignModerator}
            >
              <Text style={styles.buttonText}>
                {moderatorAssigned === 'Assigned' ? 'Reassign Moderator' : 'Assign Moderator'}
              </Text>
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
    paddingVertical: 10,
    paddingHorizontal: 60,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 0,
  },
  acceptButton: {
    backgroundColor: 'green', // Modified background color for accept button
  },
  rejectButton: {
    backgroundColor: 'red', // Modified background color for reject button
  },
  modButton: {
    backgroundColor: '#243DB7', // Modified background color for reject button
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  button2: {
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 80,
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

export default COProjInfoScreen;
