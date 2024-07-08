import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const TASKS_PER_PAGE = 5; // Number of tasks per page

const App = () => {
  const [taskGroups, setTaskGroups] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(width * 0.2); // Initial width of sidebar
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  useEffect(() => {
    const loadTaskGroups = async () => {
      try {
        const storedTaskGroups = await AsyncStorage.getItem('taskGroups');
        if (storedTaskGroups !== null) {
          setTaskGroups(JSON.parse(storedTaskGroups));
        }
      } catch (error) {
        console.error('Failed to load task groups.', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
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
    <View style={styles.card}>
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

  const handleNextPage = () => {
    if ((currentPage - 1) * TASKS_PER_PAGE + TASKS_PER_PAGE < taskGroups.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedTaskGroups = taskGroups.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

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
              data={paginatedTaskGroups}
              renderItem={renderTaskGroup}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.cardsContainer}
            />
            <TouchableOpacity onPress={addTaskGroup} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add New Task</Text>
            </TouchableOpacity>
            {taskGroups.length > TASKS_PER_PAGE && (
              <View style={styles.pagination}>
                <TouchableOpacity
                  onPress={handlePreviousPage}
                  style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
                  disabled={currentPage === 1}
                >
                  <Text style={styles.paginationButtonText}>Previous</Text>
                </TouchableOpacity>
                <Text style={styles.paginationText}>
                  Page {currentPage} of {Math.ceil(taskGroups.length / TASKS_PER_PAGE)}
                </Text>
                <TouchableOpacity
                  onPress={handleNextPage}
                  style={[styles.paginationButton, currentPage * TASKS_PER_PAGE >= taskGroups.length && styles.disabledButton]}
                  disabled={currentPage * TASKS_PER_PAGE >= taskGroups.length}
                >
                  <Text style={styles.paginationButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 80,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#343A40',
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
    backgroundColor: '#495057',
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 5,
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
    maxWidth: 500, // Limit maximum width of form container
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardsContainer: {
    alignItems: 'center', // Center the cards
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  paginationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#6c757d',
  },
  footer: {
    height: 60,
    backgroundColor: '#343A40',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
