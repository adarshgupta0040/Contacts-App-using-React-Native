import { View, TouchableOpacity, Dimensions,Alert, PermissionsAndroid, StyleSheet, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Switch, TextInput, useTheme, Text, MD3Colors, IconButton, Portal, Modal } from 'react-native-paper';
import { openDatabase } from 'react-native-sqlite-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const UpdateContact = ({ route,navigation }: any) => {
  const { userdata } = route.params;

  const { width } = Dimensions.get('screen');
  const isFavoriteBoolean = userdata.isFavorite == 1 ? true : false;
  console.log(isFavoriteBoolean)
  const [isSwitchOn, setIsSwitchOn] = React.useState(isFavoriteBoolean);

  const [nameError, setNameError] = useState<boolean>(false);
  const [phoneNoError, setPhoneNoError] = useState<boolean>(false);

  const theme = useTheme();

  const [ImageClick, setImageClick] = useState(true);
  const [name, setName] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [ImageUrl, setImageUrl] = useState<any>(userdata.imageUrl);
  const [landlineNo, setLandLineNo] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const validateForm = ():boolean =>{

    {!name ? setNameError(true) : setNameError(false)}

    {!PhoneNo ? setPhoneNoError(true) : setPhoneNoError(false)}

    if(!name || !PhoneNo){
      return false;
    }else{
      return true;
    }
  }

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn)
    console.log(isSwitchOn);
    setIsFavorite(!isFavoriteBoolean );
  };

  useEffect(() => {
    setName(userdata.name);
    setPhoneNo(String(userdata.phoneNo));
    setLandLineNo(userdata.landlineNo);
    setImageUrl(userdata.imageUrl);
    setIsFavorite(userdata.isFavorite);
    console.log(userdata.id,userdata.isFavorite);
  }, []);


  const updateUser = async () => {
    if(!validateForm()){
      Alert.alert(
        'Warning !',
        'Verify Input Fields',
        [
          {
            text: 'Ok',
            onPress: () => {console.log("Check Update User Records")},
          },
        ],
        { cancelable: false }
      );
    }
    else{

    const db = await openDatabase({ name: 'ContactDatabase.db' });
    console.log("Update User : " + name);
    console.log( name, PhoneNo,landlineNo, ImageUrl, isFavorite);
  
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE contact set username=?, phoneno=? , landlineno=?, imageurl=?, isfavorite=? where user_id=?',
        [name, PhoneNo, landlineNo, ImageUrl, isFavorite, userdata.id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'User updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              { cancelable: false }
            );
          } 
          else{
           console.log('Updation Failed');
          }
        }
      );
    });
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
          } else if (response.assets) {

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
        {ImageUrl ? <Avatar.Image size={85} source={{uri:ImageUrl}} /> : <Avatar.Image size={85} source={require('../images/user.png')} />}
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

      {nameError ? <Text style={{color: 'red'}}>Name is required</Text>: null}

      <TextInput
        mode="outlined" 
        label="Phone No."
        placeholder="Phone No."
        keyboardType='numeric'
        value={PhoneNo}
        onChangeText={text => setPhoneNo(text)}
        style={styles.inputContainer}
      />

      {phoneNoError ? <Text style={{color: 'red'}}>Phone No. is required</Text>: null}

      <TextInput
        mode="outlined"
        label="Landline No."
        placeholder="Landline No."
        keyboardType='numeric'
        value={landlineNo}
        onChangeText={text => setLandLineNo(text)}
        style={styles.inputContainer}
      />

      <View
        style={styles.favoriteContainer}>
        <Text variant="bodyLarge" style={styles.favoriteContainerText}>Add to favorites</Text>

        <Switch
          trackColor={{ false: '#3e3e3e', true:'blue'}}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#3e3e3e"
          onValueChange={onToggleSwitch}
          value={isSwitchOn}
        />

      </View>

      <View style={styles.buttonContainer}>
        <Button 
        buttonColor={theme.colors.tertiary} 
        style={styles.button} 
        mode="contained-tonal" 
        dark 
        onPress={() => { updateUser()}}
        >
          UPDATE  CONTACT
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
  container: { flex: 1, 
    alignItems: 'center', 
    backgroundColor: '#d8e2dc',
     paddingVertical: 30 
  },
  imageContainer: { 
    alignContent: 'center', 
    margin: 10 
  },
  imageLabel: {
    textAlign: 'center'
  },
  inputContainer:{ 
    width: Dimensions.get('screen').width - 70, 
    marginVertical: 15 
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
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    width: Dimensions.get('screen').width - 80
  },
  favoriteContainerText: {
    fontSize: 16
  },
  buttonContainer:{ 
    flex: 1, 
    alignItems: 'center', 
    margin: 20, 
  },
  button: {
    width: Dimensions.get('screen').width - 70,
    borderRadius:10
  },
  modal: { 
    backgroundColor: '#f8edeb', 
    padding: 30, 
    margin: 10, 
    bottom: 2, 
    position: 'absolute', 
    width: 390, 
    borderRadius: 20 
  },
  modelText:{ 
    textAlign: 'center',
  },
  modalButtonContainer:{ 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 10 
  },
  modalButtonLabel:{ 
    textAlign: 'center' 
  },


})

export default UpdateContact