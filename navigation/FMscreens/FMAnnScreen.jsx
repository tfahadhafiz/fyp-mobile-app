import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import Modal from 'react-native-modal';

import { AuthContext } from '../../AuthContext';

export default function FMAnnScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalButtonText, setModalButtonText] = useState('');
  const handleModalButtonPress = () => {
    if (modalButtonText === 'Try again') {
      setModalVisible(false);
    } else if (modalButtonText === 'OK') {
      setModalVisible(false);
      fetchAnnouncements();
    }
  
    // Close the modal
    setModalVisible(false);
  };

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);  

  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isFocused) {
      fetchAnnouncements();
    }
  }, [isFocused]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://3.26.23.172/announcements');
      if (response.ok) {
        const data = await response.json();
  
        // Separate pinned announcements from the rest
        const pinnedAnnouncements = data.filter(
          (announcement) => announcement.ispinned && announcement.ispinned === 'Yes'
        );
        const otherAnnouncements = data.filter(
          (announcement) => !(announcement.ispinned && announcement.ispinned === 'Yes')
        );
  
        // Sort the unpinned announcements by date in descending order
        const sortedOtherAnnouncements = otherAnnouncements.sort(
          (a, b) => new Date(b.anndateposted) - new Date(a.anndateposted)
        );
  
        // Concatenate pinned announcements at the beginning of the list
        const sortedData = [...pinnedAnnouncements, ...sortedOtherAnnouncements];
  
        setAnnouncements(sortedData);
      } else {
        throw new Error('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const openDropdown = (announcement, event) => {
    setSelectedAnnouncement(announcement);
    const { pageX, pageY } = event.nativeEvent;
    
    const dropdownWidth = 120; // Update this with the width of the dropdown container
    const dropdownHeight = 5; // Update this with the desired height of the dropdown container
    const yOffset = 5; // Update this with the desired vertical offset
    
    const leftPosition = pageX - dropdownWidth;
    const topPosition = pageY - dropdownHeight - yOffset;
    
    setDropdownPosition({ top: topPosition, left: leftPosition });
    setDropdownVisible(true);
  };


  const closeDropdown = () => {
    setSelectedAnnouncement(null);
    setDropdownVisible(false);
  };
    
  const handlePinAnnouncement = async (selectedAnnouncement) => {
    try {
      const response = await fetch('http://3.26.23.172/update_announcement_pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annId: selectedAnnouncement.annid,
          isPinned: 'Yes',
        }),
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Announcement pinned');
        setModalButtonText('OK');
        setModalVisible(true);
        setDropdownVisible(false);
      } else {
        setModalTitle('Error');
        setModalMessage('Something went wrong');
        setModalButtonText('Try again');
        setModalVisible(true);
        setDropdownVisible(false);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Something went wrong');
      setModalButtonText('Try again');
      setModalVisible(true);
      setDropdownVisible(false);
    }
  };

  const handleDeleteAnnouncement = (selectedAnnouncement) => {
    setAnnouncementToDelete(selectedAnnouncement.annid);
    setDeleteConfirmationVisible(true);
    setDropdownVisible(false);
  };

  const confirmDeleteAnnouncement = async () => {
    try {
      const response = await fetch(`http://3.26.23.172/announcements/${announcementToDelete}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Announcement deleted');
        setModalButtonText('OK');
        setModalVisible(true);
        setDropdownVisible(false);
      } else {
        setModalTitle('Error');
        setModalMessage('Something went wrong');
        setModalButtonText('Try again');
        setModalVisible(true);
        setDropdownVisible(false);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Something went wrong');
      setModalButtonText('Try again');
      setModalVisible(true);
      setDropdownVisible(false);
    }
  
    setDeleteConfirmationVisible(false);
  };
  
  const handleUnpinAnnouncement = async (selectedAnnouncement) => {
    try {
      const response = await fetch('http://3.26.23.172/update_announcement_pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          annId: selectedAnnouncement.annid,
          isPinned: 'No',
        }),
      });
  
      if (response.ok) {
        setModalTitle('Success!');
        setModalMessage('Announcement unpinned');
        setModalButtonText('OK');
        setModalVisible(true);
        setDropdownVisible(false);
      } else {
        setModalTitle('Error');
        setModalMessage('Something went wrong');
        setModalButtonText('Try again');
        setModalVisible(true);
        setDropdownVisible(false);
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Something went wrong');
      setModalButtonText('Try again');
      setModalVisible(true);
      setDropdownVisible(false);
    }
  };

    const renderAnnouncement = (item, layout) => {
      const formattedDate = new Date(item.anndateposted).toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    
      const isCurrentUser = item.annpostedby === user?.name;
    
      return (
        <TouchableOpacity style={[styles.announcementContainer, item.ispinned === 'Yes' && { borderColor: 'blue' },]} key={item.annid}>
          <View style={styles.announcementHeader}>
            {item.ispinned === 'Yes' && (
              <View style={styles.pinContainer}>
                <Ionicons name="bookmark" size={15} color="blue" style={styles.pinIcon} />
                <Text style={styles.pinText}>Pinned Announcement</Text>
              </View>
             )}
            <Text style={styles.title}>{item.anntitle}</Text>
            {isCurrentUser && (
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={(event) => openDropdown(item, event)}
              >
                <Ionicons name="ellipsis-horizontal" size={16} color="#343a40" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.postedBy}>Posted by: {item.annpostedby}</Text>
            <Text style={styles.datePosted}>| {formattedDate}</Text>
          </View>
          <Text style={styles.description}>{item.anndescription}</Text>
          {item.upload && item.upload.length > 0 && (
            <View style={styles.attachmentContainer}>
              <Text style={styles.attachmentsTitle}>Attachments:</Text>
              {item.upload.map((attachment, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.attachmentItem}
                  onPress={() => Linking.openURL(attachment.fileUrl)}
                >
                  <Ionicons name="cloud-download-outline" size={16} color="#0000EE" />
                  <Text style={styles.attachmentText}>{attachment.fileName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
  
          {/* Dropdown Modal */}
          <Modal visible={dropdownVisible} transparent>
            <TouchableOpacity style={styles.modalBackdrop} onPress={closeDropdown}>
              <View style={[styles.dropdownContainer, dropdownPosition]}>
                {!selectedAnnouncement?.ispinned || selectedAnnouncement.ispinned !== "Yes" ? (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handlePinAnnouncement(selectedAnnouncement)}
                  >
                    <Text style={styles.dropdownText}>Pin</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleUnpinAnnouncement(selectedAnnouncement)}
                  >
                    <Text style={styles.dropdownText}>Unpin</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleDeleteAnnouncement(selectedAnnouncement)}
                >
                  <Text style={styles.dropdownText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <Modal isVisible={isModalVisible} backdropColor="#000" backdropOpacity={0.5}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalText}>{modalMessage}</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleModalButtonPress}>
              <Text style={styles.modalButtonText}>{modalButtonText}</Text>
            </TouchableOpacity>
          </View>
        </Modal>

          <Modal isVisible={deleteConfirmationVisible} backdropColor="#000" backdropOpacity={0.5}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Deletion</Text>
              <Text style={styles.modalText}>Are you sure you want to delete this announcement?</Text>

              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[styles.modalButton, { marginRight: 10 }]} onPress={confirmDeleteAnnouncement}>
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#DD0000' }]}
                  onPress={() => setDeleteConfirmationVisible(false)}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

        </TouchableOpacity>
      );
    };
  
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {announcements.map((item, index) => renderAnnouncement(item))}
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.navigate('FMCreateAnnScreen')}
          style={styles.addButton}
        >
          <Ionicons name="ios-add" size={52} color="white" />
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 80,
      paddingHorizontal: 8,
    },
    announcementContainer: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 4,
      padding: 12,
      marginTop: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 15,
      fontWeight: 'bold',
      color: '#212529',
      marginBottom: 1,
    },
    infoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    postedBy: {
      fontSize: 11,
      color: '#888',
    },
    datePosted: {
      fontSize: 11,
      color: '#888',
      marginLeft: 4,
    },
    description: {
      fontSize: 13,
      color: '#343a40',
      marginBottom: 2,
      marginTop: 4,
    },
    attachmentContainer: {
      marginTop: 8,
    },
    attachmentsTitle: {
      fontSize: 13,
      fontWeight: 'bold',
      color: '#343a40',
      marginBottom: 4,
    },
    attachmentItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    attachmentText: {
      fontSize: 12,
      color: '#0000EE',
      marginBottom: 4,
      marginLeft: 4,
    },
    addButton: {
      position: 'absolute',
      bottom: 15,
      right: 15,
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#243DB7',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdownButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 0,
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownContainer: {
      position: 'absolute',
      backgroundColor: '#fff',
      borderRadius: 0, // Adjust this value as needed
      padding: 4, // Adjust this value as needed
      elevation: 2,
      zIndex: 1, // Add this line to ensure the dropdown container appears above other elements
      width: 100, // Adjust this value as needed
      alignItems: 'flex-start', // Align the text to the left
    },
    dropdownItem: {
      paddingVertical: 2,
      paddingHorizontal: 10,
      flexDirection: 'row', // Add this line to arrange the text and button horizontally
      alignItems: 'center', // Add this line to vertically center the content
    },
    dropdownText: {
      flex: 1, // Add this line to allow the text to take up the remaining space
      fontSize: 13,
      color: '#212529',
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
    pinContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      marginBottom: 4,
    },
    pinIcon: {
      marginRight: 4,
    },
    pinText: {
      fontSize: 11,
      color: 'blue',
    },
  });
