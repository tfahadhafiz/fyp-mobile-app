import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';

export default function SUAnnScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const isFocused = useIsFocused();

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

  const renderAnnouncement = (item) => {
    const formattedDate = new Date(item.anndateposted).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });

    return (
        <View style={[styles.announcementContainer, item.ispinned === 'Yes' && { borderColor: 'blue' },]} key={item.annid}>
            {item.ispinned === 'Yes' && (
              <View style={styles.pinContainer}>
                <Ionicons name="bookmark" size={15} color="blue" style={styles.pinIcon} />
                <Text style={styles.pinText}>Pinned Announcement</Text>
              </View>
             )}
        <Text style={styles.title}>{item.anntitle}</Text>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {announcements.map(renderAnnouncement)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 8,
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
