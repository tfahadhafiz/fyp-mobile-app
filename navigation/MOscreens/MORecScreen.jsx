import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../AuthContext';
import { Avatar } from 'react-native-elements';

export default function MORecScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <View style={styles.profileImage}>
          <Avatar
            rounded
            size={150}
            title={user.name.charAt(0)}
            containerStyle={styles.avatarContainer}
            titleStyle={{ textAlign: 'center', lineHeight: 100 }}
          />
        </View>

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>

        <View style={styles.userRoleContainer}>
          <Ionicons name="checkmark-circle-outline" size={15} color="#243DB7" style={styles.userRoleIcon} />
          <Text style={styles.userRole}>Moderator</Text>
        </View>
      </View>

      <View style={styles.lowerContainer}>
        <TouchableOpacity
          style={styles.menuItemContainer}
          onPress={() => navigation.navigate('ListOfSupervisors')}
        >
          <Ionicons name="ear-outline" size={24} color="#212529" style={styles.listIcon} />
          <Text style={styles.menuItem}>List of Supervisors</Text>
          <Ionicons name="chevron-forward" size={24} color="#212529" style={styles.listIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItemContainer}
          onPress={() => navigation.navigate('ListOfModerators')}
        >
          <Ionicons name="eye-outline" size={24} color="#212529" style={styles.listIcon} />
          <Text style={styles.menuItem}>List of Moderators</Text>
          <Ionicons name="chevron-forward" size={24} color="#212529" style={styles.listIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItemContainer}
          onPress={() => navigation.navigate('ListOfStudents')}
        >
          <Ionicons name="person-outline" size={24} color="#212529" style={styles.listIcon} />
          <Text style={styles.menuItem}>List of Students</Text>
          <Ionicons name="chevron-forward" size={24} color="#212529" style={styles.listIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItemContainer}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#212529" style={styles.listIcon} />
          <Text style={styles.menuItem}>Log out</Text>
          <Ionicons name="chevron-forward" size={24} color="#212529" style={styles.listIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#F2F2F2',
    paddingTop: 10,
  },
  upperContainer: {
    width: '95%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 40,
    marginBottom: 5,
  },
  userRoleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  profileImage: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    width: 100,
    height: 100,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 5,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 0,
  },
  userEmail: {
    fontSize: 13,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 12,
    marginBottom: 0,
    color: '#243DB7',
  },
  lowerContainer: {
    width: '95%',
    backgroundColor: 'white',
    padding: 0,
    marginTop: 0,
    alignItems: 'stretch',
  },
  menuItemContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    flex: 1,
    fontSize: 14,
    color: '#212529',
    marginTop: 5,
    marginBottom: 5,
  },
  listIcon: {
    marginRight: 8,
    marginLeft: 0,
  },
  userRoleIcon: {
    marginRight: 5,
  },
});
