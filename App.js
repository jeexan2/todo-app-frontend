import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const App = () => {
  const [taskGroups, setTaskGroups] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(width * 0.2); // Initial width of sidebar

  useEffect(() => {
    const loadTaskGroups = async () => {
      try {
        const storedTaskGroups = await AsyncStorage.getItem('taskGroups');
        if (storedTaskGroups !== null) {
          setTaskGroups(JSON.parse(storedTaskGroups));
        }
      } catch (error) {
        console.error('Failed to load task groups.', error);
      }
    };

    loadTaskGroups();
  }, []);

  useEffect(() => {
    const saveTaskGroups = async () => {
      try {
        await AsyncStorage.setItem('taskGroups', JSON.stringify(taskGroups));
      } catch (error) {
        console.error('Failed to save task groups.', error);
      }
    };

    saveTaskGroups();
  }, [taskGroups]);

  const addTaskGroup = () => {
    setTaskGroups([...taskGroups, { id: Date.now().toString(), name: 'New Task Group', tasks: [] }]);
  };

  const removeTaskGroup = (id) => {
    setTaskGroups(taskGroups.filter(group => group.id !== id));
  };

  const updateTaskGroupName = (id, newName) => {
    setTaskGroups(taskGroups.map(group => group.id === id ? { ...group, name: newName } : group));
  };

  const renderTaskGroup = ({ item }) => (
    <View style={styles.taskGroup}>
      <TextInput
        style={styles.taskGroupName}
        value={item.name}
        onChangeText={(text) => updateTaskGroupName(item.id, text)}
      />
      <TouchableOpacity onPress={() => removeTaskGroup(item.id)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>-</Text>
      </TouchableOpacity>
    </View>
  );

  const toggleSidebar = () => {
    setSidebarWidth(sidebarWidth === 0 ? width * 0.2 : 0); // Toggle sidebar width between 0 and 20% of screen width
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Task Manager</Text>
      </View>
      <View style={styles.body}>
        <View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Left sidebar content */}
          <TouchableOpacity onPress={toggleSidebar} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>{sidebarWidth === 0 ? 'Show' : 'Hide'} Sidebar</Text>
          </TouchableOpacity>
          <Text style={styles.sidebarText}>Sidebar Content</Text>
        </View>
        <View style={styles.content}>
          {/* Main content area */}
          <View style={styles.formContainer}>
            <FlatList
              data={taskGroups}
              renderItem={renderTaskGroup}
              keyExtractor={item => item.id}
            />
            <TouchableOpacity onPress={addTaskGroup} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add New Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer Content</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 80,
    backgroundColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#2ecc71',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden', // Ensure sidebar content doesn't overflow
    transitionProperty: 'width', // Enable smooth transition for width change
    transitionDuration: '0.3s', // Duration for transition animation
  },
  toggleButton: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    backgroundColor: '#27ae60',
    marginBottom: 10,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  formContainer: {
    width: '100%', // Ensure the form takes full width of content area
    maxWidth: 400, // Limit maximum width of form container
    marginBottom: 20,
  },
  taskGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  taskGroupName: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    height: 60,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
