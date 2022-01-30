import React, { useState, useEffect } from 'react'
import { Text, View, Button, Image, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, PermissionsAndroid, } from 'react-native';
import axios from 'axios';
import {api} from '../constants';
import RNFetchBlob from 'rn-fetch-blob';

const HomeScreen = ( { navigation } ) => {
    const fileUrl = `${api}`;
    const [filesList, setFilesList] = useState([]);
     const [errorMsg, setErrorMsg] = useState('');

        useEffect(() => {
            const getFilesList = async () => {
                try {
                    const { data } = await axios.get(`${api}`);
                    setErrorMsg('');
                    setFilesList(data);
                    console.log(data);
                } catch (error) {
                    error.response && setErrorMsg(error.response.data);
                }
            };

                getFilesList();
        }, []);
         const checkPermission = async () => {
            if (Platform.OS === 'ios') {
                downloadFile();
                } else {
                try {
                    const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                        'Application needs access to your storage to download File',
                    }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Start downloading
                    downloadFile();
                    console.log('Storage Permission Granted.');
                    } else {
                    // If permission denied then show alert
                    Alert.alert('Error','Storage Permission Not Granted');
                    }
                } catch (err) {
                    // To handle permission related exception
                    console.log("++++"+err);
                }
                }
            };
        //     const downloadFile = async (id, path, mimetype, image) => {
        //         try {
        //         const result = await axios.get(`${api}/download/${id}`, {
        //             responseType: 'blob'
        //         });
        //         const split = path.split('/');
        //         const filename = split[split.length - 1];
        //         setErrorMsg('');
        //         return download(result.data, filename, mimetype, image);
        //         console.log(result.data, filename, mimetype, image);
        //         } catch (error) {
        //         if (error.response && error.response.status === 400) {
        //             setErrorMsg('Error while downloading file. Try again later');
        //         }
        //         }
        //    };
          const downloadFile = () => {
        
            // Get today's date to add the time suffix in filename
            let date = new Date();
            // File URL which we want to download
            let FILE_URL = fileUrl;    
            // Function to get extention of the file url
            let file_ext = getFileExtention(FILE_URL);
        
            file_ext = '.' + file_ext[0];
        
            // config: To get response by passing the downloading related options
            // fs: Root directory path to download
            const {  config, fs } = RNFetchBlob;
            let RootDir = fs.dirs.PictureDir;
            let options = {
            fileCache: true,
            addAndroidDownloads: {
                path:
                RootDir+
                '/file_' + 
                Math.floor(date.getTime() + date.getSeconds() / 2) +
                file_ext,
                description: 'downloading file...',
                notification: true,
                // useDownloadManager works with Android only
                useDownloadManager: true,   
            },
            };
            config(options)
            .fetch('GET', FILE_URL)
            .then(res => {
                // Alert after successful downloading
                console.log('res -> ', JSON.stringify(res));
                alert('File Downloaded Successfully.');
            });
        };
 
            const getFileExtention = fileUrl => {
                // To get the file extension
                return /[.]/.exec(fileUrl) ?
                        /[^.]+$/.exec(fileUrl) : undefined;
            };
        
    return (
        <ScrollView >
            <Text>Home Screen</Text>
            <Button
                title="Go to uploads"
                onPress={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate('Upload', {
                    itemId: 86,
                    otherParam: 'anything you want here',
                });
                }}
            />
            <SafeAreaView style={styles.droidSafeArea}>
               {filesList.map(({_id, file_path, file_mimetype, image}) => (
                   <View key={_id} style={styles.cardRight}>
                     <Image source={{ uri: image ? image : 'https://cdn.pixabay.com/photo/2016/09/23/11/37/cardboard-1689424_960_720.png' }} style={styles.pizzaImage} />
                           <TouchableOpacity  >
                                    <Button 
                                        onPress={checkPermission} 
                                        title="Download"
                                    />
                            </TouchableOpacity>
                    </View> 
               ))}
            </SafeAreaView>
       </ScrollView>
    )
}

const styles = StyleSheet.create({
cardRight: {
alignItems: 'center',
 justifyContent: 'center',
},
pizzaImage: {
  marginTop: 20,
  height: 400,
  width: 300,
  resizeMode: 'contain',
   borderRadius: 20,
},
 droidSafeArea: {
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
})

export default HomeScreen
