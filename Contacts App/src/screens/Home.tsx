import { View, Text, StatusBar, FlatList, Image, TextInput, StyleSheet, TouchableOpacity, Dimensions, TouchableHighlight, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Drawer, FAB, Button, useTheme, IconButton, MD3Colors, Icon, } from 'react-native-paper'
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

const Home = ({ navigation }: any) => {

  const isfocused = useIsFocused();
  const [data, setdata] = useState([])
  const [searchText, setSearchText] = useState('')
  const [filteredContacts, setFilteredContacts] = useState(data)

  const handleSearch = (text: string) => {

    setSearchText(text)
    if (text.trim() !== '') {
      const filtered = data.filter((contact: any) => {
        return contact.username.toLowerCase().includes(text.toLowerCase());
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(data);
    }
  }

  useEffect(() => {
    viewContacts();
    setSearchText('');
  }, [isfocused]);

  const viewContacts = async () => {
    try {
      
      const db = await openDatabase({ name: 'ContactDatabase.db' });
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT * FROM contact Order by username COLLATE NOCASE ASC',
          [],
          (tx, results) => {
            var temp: any = [];
            for (let i = 0; i < results.rows.length; ++i) {
              console.log(results.rows.item(i))
              temp.push(results.rows.item(i));
            }
            setdata(temp);
            setFilteredContacts(temp);
          }
        );
      });
    } catch (error) {
      console.error('Error opening database:', error);
    }
  };

  const deleteContact = async (user_id: any) => {

    console.log(user_id);
    const db = await openDatabase({ name: 'ContactDatabase.db' });
    db.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM contact where user_id=?',
        [user_id],
        (tx, results) => {
          console.log('Results after Delete', results.rowsAffected, results);
          viewContacts();
        },
        error => {
          console.log(error);
        }
      );
    });
  };


  return (

    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder=" 🔍 Search"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <SwipeListView
        data={filteredContacts}
        renderItem={({ item, index }: any) => (
          <TouchableHighlight underlayColor={'#AAA'} onPress={() => {
            navigation.navigate('UpdateContact', {
              userdata: {
                id: item.user_id,
                name: item.username,
                phoneNo: item.phoneno,
                landlineNo: item.landlineno,
                imageUrl: item.imageurl,
                isFavorite: item.isfavorite
              }
            })
          }}>
            <View style={styles.itemContainer}>
              {item.imageurl === '' ? <Image style={styles.image} source={require('../images/user.png')} /> : <Image style={styles.image} source={{ uri: item.imageurl }} />}

              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.username}</Text>
                <Text style={styles.phoneText}>{item.phoneno}</Text>
              </View>
              <View style={styles.rightArrow}>
                <IconButton
                  icon="chevron-right"
                  iconColor={MD3Colors.error80}
                  size={25}
                />
              </View>
            </View>
          </TouchableHighlight>
        )}

        renderHiddenItem={({ item, rowMap }: any) => (

          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnLeft]}
              onPress={() => {

                navigation.navigate('UpdateContact', {
                  userdata: {
                    id: item.user_id,
                    name: item.username,
                    phoneNo: item.phoneno,
                    landlineNo: item.landlineno,
                    imageUrl: item.imageurl,
                    isFavorite: item.isfavorite
                  }
                })
              }}
            >
              <IconButton
                icon="account-edit"
                iconColor={MD3Colors.primary90}
                size={30}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => {
                console.log("delete pressed");
                deleteContact(item.user_id);
              }}
            >
              <IconButton
                icon="delete-sweep"
                iconColor={MD3Colors.primary90}
                size={30}
              />
            </TouchableOpacity>

          </View>
        )}
        rightOpenValue={-125}
        disableRightSwipe
        keyExtractor={(item: any) => item.user_id.toString()}
      />


      <FAB
        icon={'plus'}
        label={''}
        onPress={() => { console.log('Pressed'); navigation.navigate('AddContact') }}
        style={[styles.fabStyle]}
        color='white'
      />

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    backgroundColor: '#eee',
    padding: 8,
    marginTop: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#ffff'
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 16,
    color: '#999',
  },
  rightArrow: {
    position: 'absolute',
    right: 0
  },
  fabStyle: {
    bottom: 25,
    right: 25,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'red'
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 80,
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 60,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 60,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
})