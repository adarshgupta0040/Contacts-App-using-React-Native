import { View, Text, FlatList, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import { useIsFocused } from '@react-navigation/native';

const FavoriteContact = ({ route, navigation }:any) => {
  
  const isfocused = useIsFocused();

  const [FavoriteContacts, setFavoriteContacts] = useState([])

  const viewFavoriteContacts = async () => {
    try {

      const db = await openDatabase({ name: 'ContactDatabase.db' });
      db.transaction(function (tx) {
        tx.executeSql(
          'SELECT * FROM contact where isfavorite=1 Order by username COLLATE NOCASE ASC',
          [],
          (tx, results) => {
            var temp: any = [];
            for (let i = 0; i < results.rows.length; ++i) {
              console.log(results.rows.item(i))
              temp.push(results.rows.item(i));
            } 
            setFavoriteContacts(temp);
            
          }
        );
      });
    } catch (error) {
      console.error('Error opening database:', error);
    }
    
  };

  useEffect(() => {
    viewFavoriteContacts();
  }, [isfocused]);

  return (
    
    <FlatList
        data={FavoriteContacts}
        renderItem={({ item, index }: any) => (

          <View style={styles.itemContainer}>
            {item.imageurl === '' ? <Image style={styles.image} source={require('../images/user.png')} />: <Image style={styles.image} source={{uri: item.imageurl}} />}
            <View style={styles.textContainer}>

              <Text style={styles.nameText}>{item.username}</Text>
              <Text style={styles.phoneText}>{item.phoneno}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item: any) => item.user_id.toString()}
      />
  )
}

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
    padding: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  fabStyle: {
    bottom: 20,
    right: 20,
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'red'
  },
})

export default FavoriteContact