import { View, Dimensions, TouchableOpacity, Image, PermissionsAndroid, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Text, Button, IconButton, MD3Colors, Modal, Portal, Switch, TextInput, useTheme } from 'react-native-paper'
import { openDatabase } from 'react-native-sqlite-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddContacts = ({ navigation }: any) => {

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [nameError, setNameError] = useState<boolean>(false);
  const [phoneNoError, setPhoneNoError] = useState<boolean>(false);

  const theme = useTheme();

  const [ImageClick, setImageClick] = useState(true);
  const [name, setName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [ImageUrl, setImageUrl] = useState<any>("");
  const [landlineNo, setLandLineNo] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const validateForm = (): boolean => {

    { !name ? setNameError(true) : setNameError(false) }

    { !PhoneNo ? setPhoneNoError(true) : setPhoneNoError(false) }

    if (!name || !PhoneNo) {
      return false;
    } else {
      return true;
    }
  }

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    const openDB = async () => {
      try {

        const db = await openDatabase({ name: 'ContactDatabase.db' });
        db.transaction(function (txn) {
          txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='contact'",
            [],
            function (tx, res) {
              console.log('item:', res.rows.length);
              if (res.rows.length == 0) {
                txn.executeSql('DROP TABLE IF EXISTS contact', []);
                txn.executeSql(
                  'CREATE TABLE IF NOT EXISTS contact(user_id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR(20), phoneno INT(15), landlineno INT(20), imageurl VARCHAR(100), isfavorite VARCHAR(20))',
                  []
                );
              }
              else {
                console.log('Table already exist!!!');
              }
            }
          );
        });
      } catch (error) {
        console.error('Error opening database:', error);
      }
    };

    openDB();

  }, []);

  const saveUser = async () => {

    console.log("Valid Form ", validateForm())
    if (validateForm()) {

      console.log("new", ImageUrl);
      console.log('Submit clicked');
      console.log(ImageUrl, name, PhoneNo, landlineNo, isFavorite)

      const db = await openDatabase({ name: 'ContactDatabase.db' });
      console.log(name);
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO contact(username, phoneno, landlineno, imageurl, isfavorite) VALUES (?,?,?,?,?)',
          [name, PhoneNo, landlineNo, ImageUrl, isFavorite],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
          },
          error => {
            console.log(error);
          }
        );
      });

      navigation.navigate('Home');
    }
    else {
      console.log("Check Input and Correct Error");
    }
  };

  const imageGalaryClick = () => {

    let options: any = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 500,
      quality: 1,
      includeBase64: false
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled')
      } else if (response.errorCode) {
        console.log('ImagePickerError: ', response.errorMessage)
      } else if (response.assets) {

        setImageUrl(response.assets[0].uri);
        console.log("imageUri: ", ImageUrl);
        setImageClick(false);
        console.log(response.assets[0].uri);
        hideModal();
      }
    })
  }

  const imageCameraClick = async () => {

    let options: any = {
      mediaType: 'photo',
      saveToPhotos: true,
      maxWidth: 300,
      maxHeight: 500,
      quality: 1,
      cameraType: 'front',
      includeBase64: false
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled')
          } else if (response.errorCode) {
            console.log('ImagePickerError: ', response.errorMessage)
          } 
          else if (response.assets) {

            setImageUrl(response.assets[0].uri);
            console.log("imageUri: ", ImageUrl);
            setImageClick(false);
            console.log(response.assets[0].uri);
            hideModal();
          }
        })
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={showModal} style={styles.imageContainer}>
        {ImageClick ? <Avatar.Image size={85} source={require('../images/user.png')} /> : <Avatar.Image size={85} source={{ uri: ImageUrl }} />}
        <Text style={styles.imageLabel}>Choose image</Text>
      </TouchableOpacity>

      <TextInput
        mode="outlined"
        label="Name"
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
        style={styles.inputContainer}
      />

      {nameError ? <Text style={styles.errorText}>Name is required</Text> : null}

      <TextInput
        mode="outlined"
        label="Phone No."
        placeholder="Phone No."
        keyboardType='numeric'
        value={PhoneNo}
        onChangeText={text => setPhoneNo(text)}
        maxLength={13}
        style={styles.inputContainer}
      />

      {phoneNoError ? <Text style={styles.errorText}>Phone No. is required</Text> : null}

      <TextInput
        mode="outlined"
        label="Landline No."
        keyboardType='numeric'
        placeholder="Landline No."
        value={landlineNo}
        onChangeText={text => setLandLineNo(text)}
        style={styles.inputContainerLandline}
      />

      <View
        style={styles.favoriteContainer}>
        <Text style={styles.favoriteContainerText}> Add to favorites </Text>

        <Switch
          trackColor={{ false: '#3e3e3e', true: 'blue' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggleSwitch}
          value={isSwitchOn}
        />
      </View>


      <View style={styles.buttonContainer}>
        <Button buttonColor={theme.colors.tertiary} mode="contained-tonal"
          style={styles.button}
          dark
          onPress={() => saveUser()}
        >
          SAVE  CONTACT
        </Button>
      </View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>

          <Text variant="headlineSmall" style={styles.modelText}> Upload Photo </Text>
          <Text variant="bodyMedium" style={styles.modelText}> Choose your profile picture </Text>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity onPress={() => {
              console.log('Camera Pressed');
              imageCameraClick();
            }}>
              <IconButton
                icon="camera"
                mode='contained'
                iconColor={MD3Colors.error50}
                size={30}

              />
              <Text style={styles.modalButtonLabel}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              console.log('Photos Pressed');
              imageGalaryClick();
            }}>
              <IconButton
                icon="image-multiple"
                mode='contained'
                iconColor={MD3Colors.error50}
                size={30}

              />
              <Text style={styles.modalButtonLabel}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
              console.log('Cancel Pressed');
              hideModal();
            }}>
              <IconButton
                icon="window-close"
                mode='contained'
                iconColor={MD3Colors.error50}
                size={30}
              />
              <Text style={styles.modalButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </View>

  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e4',
    paddingVertical: 40
  },
  imageContainer: {
    alignContent: 'center',
    marginBottom: 15
  },
  imageLabel: {
    textAlign: 'center'
  },
  inputContainer: {
    width: Dimensions.get('screen').width - 70,
    marginVertical: 18,
    marginBottom: 5
  },
  inputContainerLandline: {
    width: Dimensions.get('screen').width - 70,
    marginVertical: 18
  },
  errorText: {
    color: 'red',
    marginTop: 0,
    textAlign: 'left',
    width: 441,
    paddingLeft: 55
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    width: Dimensions.get('screen').width - 80
  },
  favoriteContainerText: {
    fontSize: 17
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 20
  },
  button: {
    width: Dimensions.get('screen').width - 70,
    borderRadius: 10,
    padding: 3
  },
  modal: {
    backgroundColor: '#f8edeb',
    padding: 30,
    margin: 10,
    bottom: 2,
    position: 'absolute',
    width: 390,
    borderRadius: 20,
  },
  modelText: {
    textAlign: 'center',
  },
  modalButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  modalButtonLabel: {
    textAlign: 'center'
  },

})

export default AddContacts

