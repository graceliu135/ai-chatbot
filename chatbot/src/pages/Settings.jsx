import {
    Box,
    VStack,
    Heading,
    FormControl,
    FormLabel,
    Switch,
    Select,
    Button,
    useToast,
    Divider,
    Text,
    Input,
    InputGroup,
    InputRightElement,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { doc, getDoc, setDoc } from 'firebase/firestore';
  import { db } from '../config/firebase';
  import { useAuth } from '../contexts/AuthContext';
  
  export function Settings() {
    const { currentUser, userProfile, updateUsername } = useAuth();
    const toast = useToast();
    const [settings, setSettings] = useState({
      saveShortTermSessions: false,
      defaultStudyDuration: 30,
      notifications: true,
      theme: 'light',
    });
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
  
    useEffect(() => {
      if (currentUser) {
        loadSettings();
        setUsername(userProfile?.username || currentUser.email.split('@')[0]);
      }
    }, [currentUser, userProfile]);
  
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'userSettings', currentUser.uid));
        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error loading settings',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
  
    const handleSettingChange = (field, value) => {
        setSettings(prev => ({
          ...prev,
          [field]: value
        }));
      };
    
      const saveSettings = async () => {
        if (!currentUser) return;
        
        setSaving(true);
        try {
          const settingsRef = doc(db, 'userSettings', currentUser.uid);
          
          // Ensure all fields are present
          const settingsToSave = {
            saveShortTermSessions: settings.saveShortTermSessions || false,
            defaultStudyDuration: settings.defaultStudyDuration || 30,
            notifications: settings.notifications || false,
            theme: settings.theme || 'light',
          };
    
          await setDoc(settingsRef, settingsToSave, { merge: true });
          
          toast({
            title: 'Settings saved successfully',
            status: 'success',
            duration: 3000,
          });
        } catch (error) {
          console.error('Error saving settings:', error);
          toast({
            title: 'Error saving settings',
            description: error.message,
            status: 'error',
            duration: 3000,
          });
        } finally {
          setSaving(false);
        }
      };
        
    const handleUsernameUpdate = async () => {
      try {
        await updateUsername(username);
        setIsEditingUsername(false);
        toast({
          title: 'Username updated successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Error updating username',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      }
    };
  
    if (!currentUser) return null;
  
    return (
      <Box maxW="800px" mx="auto" mt={8} p={4}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Settings</Heading>
  
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <VStack spacing={6} align="stretch">
              {/* Profile Section */}
              <Heading size="md">Profile</Heading>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isDisabled={!isEditingUsername}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={isEditingUsername ? handleUsernameUpdate : () => setIsEditingUsername(true)}
                    >
                      {isEditingUsername ? 'Save' : 'Edit'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
  
              <Divider />
  
              {/* Study Settings */}
              <Heading size="md">Study Settings</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Save Short-Term Study Sessions
                </FormLabel>
                <Switch
                  isChecked={settings.saveShortTermSessions}
                  onChange={(e) => setSettings({
                    ...settings,
                    saveShortTermSessions: e.target.checked
                  })}
                />
              </FormControl>
  
              <FormControl>
                <FormLabel>Default Study Duration (minutes)</FormLabel>
                <Select
                  value={settings.defaultStudyDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    defaultStudyDuration: Number(e.target.value)
                  })}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </Select>
              </FormControl>
  
              <Divider />
  
              {/* Notification Settings */}
              <Heading size="md">Notifications</Heading>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Enable Notifications
                </FormLabel>
                <Switch
                  isChecked={settings.notifications}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: e.target.checked
                  })}
                />
              </FormControl>
  
              <Divider />
  
              {/* Theme Settings */}
              <Heading size="md">Appearance</Heading>
              <FormControl>
                <FormLabel>Theme</FormLabel>
                <Select
                  value={settings.theme}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: e.target.value
                  })}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </Select>
              </FormControl>
  
              <Button
                colorScheme="blue"
                onClick={saveSettings}
                isLoading={saving}
                loadingText="Saving..."
                mt={4}
              >
                Save Settings
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  }