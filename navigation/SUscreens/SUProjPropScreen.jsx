import React, { useState, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { AuthContext } from '../../AuthContext';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function Proj_PropScreen({navigation}) {
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
        navigation.goBack();
      }
    
      // Close the modal
      setModalVisible(false);
    };

    const [projectTitle, setProjectTitle] = useState('');
    const [projectType, setProjectType] = useState('');
    const [projectSpecialization, setProjectSpecialization] = useState('');
    const [projectFocus, setProjectFocus] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectObjectives, setProjectObjectives] = useState('');
    const [projectScope, setProjectScope] = useState('');
    const [numOfStudents, setNumOfStudents] = useState('');
    const [isStudent2SubtitleEnabled, setIsStudent2SubtitleEnabled] = useState(false); // new state variable
    const [studentOneSub, setStudentOneSub] = useState('');
    const [studentOneWork, setStudentOneWork] = useState('');
    const [studentTwoSub, setStudentTwoSub] = useState('');
    const [studentTwoWork, setStudentTwoWork] = useState('');
    const [industryCollab, setIndustryCollab] = useState('');
    const [isIndustryCollabEnabled, setIsIndustryCollabEnabled] = useState(false); // new state variable
    const [industryCompany, setIndustryCompany] = useState('');
    const [industryContact, setIndustryContact] = useState('');
    
    const [isTitleSelected, setIsTitleSelected] = useState(false);
    const [isFocusSelected, setIsFocusSelected] = useState(false);
    const [isDescriptionSelected, setIsDescriptionSelected] = useState(false);
    const [isObjectivesSelected, setIsObjectivesSelected] = useState(false);
    const [isScopeSelected, setIsScopeSelected] = useState(false);

    const [isTitleEmpty, setIsTitleEmpty] = useState(false);
    const [isFocusEmpty, setIsFocusEmpty] = useState(false);
    const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
    const [isObjectivesEmpty, setIsObjectivesEmpty] = useState(false);
    const [isScopeEmpty, setIsScopeEmpty] = useState(false);

    const [projectTypeError, setProjectTypeError] = useState(false);
    const [projectSpecializationError, setProjectSpecializationError] = useState(false);
    const [numOfStudentsError, setNumOfStudentsError] = useState(false);
    const [industryCollabError, setIndustryCollabError] = useState(false);

    const handleProjectTitleChange = (text) => {
        setProjectTitle(text);
    };
    
    const handleProjectTypeChange = (value) => {
        setProjectType(value);
        if (value === '') {
          setProjectTypeError(true);
        } else {
          setProjectTypeError(false);
        }
      };
  
    const handleProjectSpecializationChange = (value) => {
        setProjectSpecialization(value);
        if (value === '') {
          setProjectSpecializationError(true);
        } else {
          setProjectSpecializationError(false);
        }
      };
      
    const handleProjectFocusChange = (text) => {
        setProjectFocus(text);
    };
      
    const handleProjectDescriptionChange = (text) => {
        setProjectDescription(text);
    };
  
    const handleProjectObjectivesChange = (text) => {
        setProjectObjectives(text);
    };
      
    const handleProjectScopeChange = (text) => {
        setProjectScope(text);
    };
  
    const handleNumOfStudentsChange = (value) => {
        setNumOfStudents(value);
        if (value === '') {
          setNumOfStudentsError(true);
        } else {
          setNumOfStudentsError(false);
        }
        setIsStudent2SubtitleEnabled(value === '2'); // enable the input if 2 is selected
    };

    const handleIndustryCollab = (value) => {
        setIndustryCollab(value);
        if (value === '') {
          setIndustryCollabError(true);
        } else {
          setIndustryCollabError(false);
        }
        setIsIndustryCollabEnabled(value === 'Yes'); // enable the input if Yes is selected
      };

    const handleStudentOneSubChange = (text) => {
        setStudentOneSub(text);
    };
  
    const handleStudentOneWorkChange = (text) => {
        setStudentOneWork(text);
    };
      
    const handleStudentTwoSubChange = (text) => {
        setStudentTwoSub(text);
    };
  
    const handleStudentTwoWorkChange = (text) => {
        setStudentTwoWork(text);
    };
  
    const handleIndustryCompanyChange = (text) => {
        setIndustryCompany(text);
    };
  
    const handleIndustryContactChange = (text) => {
        setIndustryContact(text);
    };

    const handleTitleFocus = () => {
      setIsTitleSelected(true);
    };
  
    const handleFocusFocus = () => {
      setIsFocusSelected(true);
    };

    const handleDescriptionFocus = () => {
      setIsDescriptionSelected(true);
    };
  
    const handleObjectivesFocus = () => {
      setIsObjectivesSelected(true);
    };

    const handleScopeFocus = () => {
      setIsScopeSelected(true);
    };
  
    const handleTitleBlur = () => {
      setIsTitleSelected(false);
      setIsTitleEmpty(projectTitle === '');
    };
  
    const handleFocusBlur = () => {
      setIsFocusSelected(false);
      setIsFocusEmpty(projectFocus === '');
    };

    const handleDescriptionBlur = () => {
      setIsDescriptionSelected(false);
      setIsDescriptionEmpty(projectDescription === '');
    };

    const handleObjectivesBlur = () => {
      setIsObjectivesSelected(false);
      setIsObjectivesEmpty(projectObjectives === '');
    };
  
    const handleScopeBlur = () => {
      setIsScopeSelected(false);
      setIsScopeEmpty(projectScope === '');
    };

    const handleSubmit = async () => {
      try {
        if (!projectTitle || !projectType || !projectSpecialization || !projectFocus || !projectDescription || !projectObjectives || !projectScope || !numOfStudents || !industryCollab) {
          setModalTitle('Error');
          setModalMessage('Please ensure that you fill in and select all the required fields');
          setModalButtonText('Try again');
          setModalVisible(true);
          return;
        }
    
        const response = await fetch('http://3.26.23.172/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectTitle,
            projectType,
            projectSpecialization,
            projectFocus,
            projectDescription,
            projectObjectives,
            projectScope,
            numOfStudents,
            studentOneSub,
            studentOneWork,
            studentTwoSub,
            studentTwoWork,
            industryCollab,
            industryCompany,
            industryContact,
            projectStatus: 'Pending',
            studentAssigned: 'Not Assigned',
            moderatorAssigned: 'Not Assigned',
            projectPostedBy: user.name,
            supervisor_id: user?.accid,
          }),
        });
    
        if (response.ok) {
          setModalTitle('Success!');
          setModalMessage('Project proposed');
          setModalButtonText('OK');
          setModalVisible(true);
        } else {
          console.error('Error creating project:', response.statusText);
          // Handle any error logic here
        }
      } catch (error) {
        console.error('Error creating project:', error);
        // Handle any error logic here
      }
    };    

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20 }}>
          <Text style={{ color: 'grey', fontSize: 12, textAlign: 'center' }}>Enter Your Project Details</Text>
          <View style={{ marginVertical: 20 }}>
          <Text style={styles.label}>Project Title:</Text>
          <View
            style={[
              styles.inputContainer,
              (!isTitleSelected && isTitleEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={handleProjectTitleChange}
              onFocus={handleTitleFocus}
              onBlur={handleTitleBlur}
              value={projectTitle}
              placeholder="Enter Project Title"
              placeholderTextColor="grey"
            />
          </View>
          {!isTitleSelected && isTitleEmpty && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please enter project title</Text>
            </View>
          )}
        </View>
          
          <View style={{ marginVertical: 0 }}>
            <Text style={styles.label}>Project Type:</Text>
            <View style={[styles.pickerContainer, projectTypeError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
                <Picker
                    selectedValue={projectType}
                    onValueChange={handleProjectTypeChange}
                >
                <Picker.Item label="Select Project Type" value="" style={{fontSize:14, color: 'grey' }}/>
                <Picker.Item label="Research Based" value="Research Based" style={{fontSize:14, color: '#212529' }}/>
                <Picker.Item label="Application Based" value="Application Based" style={{fontSize:14, color: '#212529' }}/>
                </Picker>
            </View>
            {projectTypeError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid project type</Text>
            </View>
          )}            
          </View>

          <View style={{ marginVertical: 20 }}>
            <Text style={styles.label}>Project Specialization:</Text>
            <View style={[styles.pickerContainer, projectSpecializationError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
                <Picker
              selectedValue={projectSpecialization}
              onValueChange={handleProjectSpecializationChange}
                >
                <Picker.Item label="Select Project Specialization" value="" style={{ fontSize: 14, color: 'grey' }} />
                <Picker.Item label="Information System" value="Information System" style={{ fontSize: 14, color: '#212529' }} />
                <Picker.Item label="Software Engineering" value="Software Engineering" style={{ fontSize: 14, color: '#212529' }} />
                <Picker.Item label="Data Science" value="Data Science" style={{ fontSize: 14, color: '#212529' }} />
                <Picker.Item label="Game Development" value="Game Development" style={{ fontSize: 14, color: '#212529' }} />
                </Picker>
            </View>
            {projectSpecializationError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid specialization</Text>
            </View>
          )}
        </View>
        
        <View style={{ marginVertical: 0 }}>
        <Text style={styles.label}>Project Focus:</Text>
          <View
            style={[
              styles.inputContainer,
              (!isFocusSelected && isFocusEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14 }}
              onChangeText={handleProjectFocusChange}
              onFocus={handleFocusFocus}
              onBlur={handleFocusBlur}
              value={projectFocus}
              placeholder="Enter Project Focus"
              placeholderTextColor="grey"
            />
          </View>
          {!isFocusSelected && isFocusEmpty && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please enter project focus</Text>
            </View>
          )}
        </View>
        
        <View style={{ marginVertical: 20 }}>
        <Text style={styles.label}>Project Description:</Text>
          <View
            style={[
              styles.inputBigContainer,
              (!isDescriptionSelected && isDescriptionEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={handleProjectDescriptionChange}
              onFocus={handleDescriptionFocus}
              onBlur={handleDescriptionBlur}
              value={projectDescription}
              placeholder="Enter Project Description"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={22}
              />
              </View>
              {!isDescriptionSelected && isDescriptionEmpty && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
                  <Text style={styles.errorText}>Please enter project description</Text>
                </View>
              )}
            </View>

        <View style={{ marginVertical: 0 }}>
          <Text style={styles.label}>Project Objectives:</Text>
          <View
            style={[
              styles.inputMediumContainer,
              (!isObjectivesSelected && isObjectivesEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={handleProjectObjectivesChange}
              onFocus={handleObjectivesFocus}
              onBlur={handleObjectivesBlur}
              value={projectObjectives}
              placeholder="Enter Project Objectives"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={12}
                />
                </View>
                {!isObjectivesSelected && isObjectivesEmpty && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
                    <Text style={styles.errorText}>Please enter project objectives</Text>
                  </View>
                )}
              </View>
        
        <View style={{ marginVertical: 20 }}>
        <Text style={styles.label}>Project Scope:</Text>
          <View
            style={[
              styles.inputMediumContainer,
              (!isScopeSelected && isScopeEmpty) && { borderColor: 'red', backgroundColor: '#FFF9F9' },
            ]}
          >
            <TextInput
              style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
              onChangeText={handleProjectScopeChange}
              onFocus={handleScopeFocus}
              onBlur={handleScopeBlur}
              value={projectScope}
              placeholder="Enter Project Scope"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={12}
                />
                </View>
                {!isScopeSelected && isScopeEmpty && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
                    <Text style={styles.errorText}>Please enter project scope</Text>
                  </View>
                )}
              </View>
          
          <View style={{ marginVertical: 0 }}>
            <Text style={styles.label}>Number of Students:</Text>
            <View style={[styles.pickerContainer, numOfStudentsError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
              <Picker
                selectedValue={numOfStudents}
                onValueChange={handleNumOfStudentsChange}
              >
                <Picker.Item label="Select Number of Students" value="" style={{ fontSize: 14, color: 'grey' }} />
                <Picker.Item label="1" value="1" style={{ fontSize: 14, color: '#212529' }} />
                <Picker.Item label="2" value="2" style={{ fontSize: 14, color: '#212529' }} />
              </Picker>
            </View>
            {numOfStudentsError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid number of students</Text>
            </View>
          )}
          </View> 
          {isStudent2SubtitleEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.label}>Student 1 Subtitle:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14 }}
                  onChangeText={handleStudentOneSubChange}
                  value={studentOneSub}
                  placeholder="Enter Student 1 Subtitle"
                  placeholderTextColor='grey'
                />
              </View>
            </View>   
          )}
          {isStudent2SubtitleEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.label}>Student 1 Work Distribution:</Text>
              <View style={styles.inputMediumContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
                  onChangeText={handleStudentOneWorkChange}
                  value={studentOneWork}
                  placeholder="Enter Student 1 Work Distribution"
                  placeholderTextColor='grey'
                  multiline={true}
                  numberOfLines={12}
                />
              </View>
            </View>   
          )}
          {isStudent2SubtitleEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.label}>Student 2 Subtitle:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14 }}
                  onChangeText={handleStudentTwoSubChange}
                  value={studentTwoSub}
                  placeholder="Enter Student 2 Subtitle"
                  placeholderTextColor='grey'
                />
              </View>
            </View>   
          )}
          {isStudent2SubtitleEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.label}>Student 2 Work Distribution:</Text>
              <View style={styles.inputMediumContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14, textAlignVertical: 'top' }}
                  onChangeText={handleStudentTwoWorkChange}
                  value={studentTwoWork}
                  placeholder="Enter Student 2 Work Distribution"
                  placeholderTextColor='grey'
                  multiline={true}
                  numberOfLines={12}
                />
              </View>
            </View>   
          )}
          <View style={{ marginVertical: 20 }}>
            <Text style={styles.label}>Industry Collaboration:</Text>
            <View style={[styles.pickerContainer, industryCollabError && { borderColor: 'red', backgroundColor: '#FFF9F9' }]}>
              <Picker
                selectedValue={industryCollab}
                onValueChange={handleIndustryCollab}
              >
                <Picker.Item label="Select Industry Collaboration" value="" style={{ fontSize: 14, color: 'grey' }} />
                <Picker.Item label="Yes" value="Yes" style={{ fontSize: 14, color: '#212529' }} />
                <Picker.Item label="No" value="No" style={{ fontSize: 14, color: '#212529' }} />
              </Picker>
            </View>
            {industryCollabError && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={16} color="red" style={{ marginLeft: 12, marginTop: 5 }} />
              <Text style={styles.errorText}>Please select a valid industry collaboration</Text>
            </View>
          )}
          </View> 
          {isIndustryCollabEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 0 }}>
              <Text style={styles.label}>Company:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14 }}
                  onChangeText={handleIndustryCompanyChange}
                  value={industryCompany}
                  placeholder="Enter Company Name"
                  placeholderTextColor='grey'
                />
              </View>
            </View>   
          )}
          {isIndustryCollabEnabled && ( // render the input only if it's enabled
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.label}>Company Contact No.:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={{ flex: 1, color: '#212529', fontSize: 14 }}
                  onChangeText={handleIndustryContactChange}
                  value={industryContact}
                  placeholder="Enter Company Contact No."
                  placeholderTextColor='grey'
                />
              </View>
            </View>   
          )}
        <View style={{ alignItems: 'center', marginBottom:20 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#243DB7', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 80, marginTop: 20 }}
            onPress={handleSubmit}
          >
            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>Submit</Text>
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
        paddingVertical: 1,
        borderWidth: 0.5,
      },
      inputBigContainer: {
        height: 385,
        backgroundColor: '#F4F5FF',
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderWidth: 0.5,
        paddingVertical: 6,
      },
      inputMediumContainer: {
        height: 220,
        backgroundColor: '#F4F5FF',
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderWidth: 0.5,
        paddingVertical: 6,
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

function SUProjScreen({ navigation }) {
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
        }}>
        <Tab.Screen name="Project Proposal" component={Proj_PropScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function SUProjPropScreen() {
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
      }}>
      <Stack.Screen name="Project" component={SUProjScreen} />
    </Stack.Navigator>
  );
}