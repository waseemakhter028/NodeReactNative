import React, {useState} from 'react';
import {Modal, PermissionsAndroid, Platform} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../../../constants/Colors';
import OS from '../../../constants/OS';
import {useContext as useAppContext} from '../../../context/AppContext';
import {useContext} from '../../../context/ToastContext';
import {
  removeFromAsyncStorage,
  saveToAsyncStorage,
} from '../../../helpers/common';
import {fp, hp} from '../../../helpers/responsive';
import useAxios from '../../../hooks/useAxios';
import {
  ImageBackground,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from '../../../storybook';
import {ProfilePhotoProps} from '../../../types';

const ProfileChangePhoto = () => {
  const {Toast} = useContext();
  const {user, setUser} = useAppContext();

  const {axiosCall} = useAxios();
  const [photo, setPhoto] = useState<ProfilePhotoProps>({
    assets: [
      {
        fileName: '',
        fileSize: 0,
        height: 0,
        originalPath: '',
        type: '',
        uri: '',
        width: 0,
      },
    ],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [removeIcon, setRemoveIcon] = useState<boolean>(false);

  const handleChoosePhoto = async () => {
    setLoading(true);
    const response = await launchImageLibrary({noData: true});
    if (!response?.didCancel) {
      setPhoto(response);
      setRemoveIcon(true);
    }
    setLoading(false);
    setIsModal(false);
  };

  const handleChoosePhotoWithCamera = async () => {
    setLoading(true);
    try {
      if (Platform.OS === OS.ANDROID) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Eyewear Camera Permission',
            message: 'Eyewear needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const response = await launchCamera({noData: true});
          if (!response?.didCancel) {
            setPhoto(response);
            setRemoveIcon(true);
          }
        } else {
          Toast('danger', 'Error !', 'Camera permission denied', 3000);
          setRemoveIcon(false);
        }
      } else {
        const response = await launchCamera({noData: true});
        if (!response?.didCancel) {
          setPhoto(response);
          setRemoveIcon(false);
        }
      }
    } catch (err: any) {
      Toast('danger', 'Error !', err.message, 3000);
    }
    setLoading(false);
    setIsModal(false);
  };

  const handleUploadPhoto = async () => {
    if (photo.assets[0].uri === '') {
      Toast('danger', 'Error !', 'Please select photo', 3000);
      return false;
    }
    setRemoveIcon(false);
    setLoading(true);
    const formData = new FormData();
    formData.append('photo', {
      name: photo.assets[0].fileName,
      type: photo.assets[0].type,
      uri:
        Platform.OS === OS.IOS
          ? photo.assets[0].uri.replace('file://', '')
          : photo.assets[0].uri,
    });
    const {data, error} = await axiosCall('/uploadimage', {
      method: 'post',
      data: formData,
    });

    const res = data;
    if (error) {
      Toast('warning', 'Warning !', error.message);
      setPhoto({
        assets: [
          {
            fileName: '',
            fileSize: 0,
            height: 0,
            originalPath: '',
            type: '',
            uri: '',
            width: 0,
          },
        ],
      });
    } else if (!error) {
      if (res.success === true) {
        Toast('success', 'Success !', 'Photo saved successfully !');
        await removeFromAsyncStorage(['user', 'token']);
        await saveToAsyncStorage({
          user: JSON.stringify(res.data),
          token: JSON.stringify(res.data.api_token),
        });
        setUser(res.data);
        setPhoto({
          assets: [
            {
              fileName: '',
              fileSize: 0,
              height: 0,
              originalPath: '',
              type: '',
              uri: '',
              width: 0,
            },
          ],
        });
      } else {
        Toast('danger', 'Error !', res.message, 3000);
        setPhoto({
          assets: [
            {
              fileName: '',
              fileSize: 0,
              height: 0,
              originalPath: '',
              type: '',
              uri: '',
              width: 0,
            },
          ],
        });
      }
    }
    setLoading(false);
  };

  return (
    <View>
      <View className="flex rswidth-w-90 rsmarginTop-h-20 items-center justify-center">
        {photo?.assets?.length > 0 && photo.assets[0].uri !== '' ? (
          <React.Fragment>
            {/* choosing image from gallery or camera*/}
            <View className="rsheight-h-15 rswidth-w-55">
              <ImageBackground
                source={{uri: photo.assets[0].uri}}
                className="rsheight-h-15 rswidth-w-55"
                resizeMode="contain">
                {removeIcon && (
                  <Pressable
                    onPress={() => {
                      setPhoto({
                        assets: [
                          {
                            fileName: '',
                            fileSize: 0,
                            height: 0,
                            originalPath: '',
                            type: '',
                            uri: '',
                            width: 0,
                          },
                        ],
                      });
                    }}
                    className="items-end rsmarginBottom-w-2">
                    <AntDesign
                      name="closecircleo"
                      size={fp(3)}
                      color={Colors.cprimaryDark}
                    />
                  </Pressable>
                )}
              </ImageBackground>
            </View>
            <Pressable
              className="bg-cprimaryDark rswidth-w-58 rspadding-w-3 rsborderRadius-w-3 rsmarginTop-h-2"
              onPress={handleUploadPhoto}
              disabled={loading}>
              <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                {!loading ? 'Upload Photo' : 'Uploading ...'}
              </Text>
            </Pressable>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* fetching previously uploaded image from db */}
            {!removeIcon && user && user?.image !== null && (
              <View className="rsheight-h-15 rswidth-w-55">
                <ImageBackground
                  source={{
                    uri: process.env.USER_IMAGE_URL + '/' + user?.image,
                  }}
                  className="rsheight-h-15 rswidth-w-55"
                  resizeMode="contain">
                  {removeIcon && (
                    <Pressable
                      onPress={() => {
                        setPhoto({
                          assets: [
                            {
                              fileName: '',
                              fileSize: 0,
                              height: 0,
                              originalPath: '',
                              type: '',
                              uri: '',
                              width: 0,
                            },
                          ],
                        });
                      }}
                      className="items-end rsmarginBottom-w-2">
                      <AntDesign
                        name="closecircleo"
                        size={fp(3)}
                        color={Colors.cprimaryDark}
                      />
                    </Pressable>
                  )}
                </ImageBackground>
              </View>
            )}
            <Pressable
              className="bg-cprimaryDark rswidth-w-58 rspadding-w-3 rsborderRadius-w-3 rsmarginTop-h-2"
              onPress={() => setIsModal(true)}
              disabled={loading}>
              <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                {!loading ? 'Choose Photo' : 'loading ...'}
              </Text>
            </Pressable>
          </React.Fragment>
        )}
      </View>
      <Modal
        visible={isModal}
        style={{
          height: hp(10),
        }}
        transparent>
        <View className="flex-1 items-center justify-center">
          <View className="bg-white rspadding-w-8 rswidth-w-90">
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => handleChoosePhoto()}>
                <Feather
                  name="image"
                  size={hp(5)}
                  color={Colors.cprimaryDark}
                />
                <Text className="rsfontSize-f-2 text-lightgreen">Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChoosePhotoWithCamera}>
                <Feather
                  name="camera"
                  size={hp(5)}
                  color={Colors.cprimaryDark}
                />
                <Text className="rsfontSize-f-2 text-lightgreen">Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLoading(false);
                  setIsModal(false);
                }}>
                <AntDesign
                  name="closecircleo"
                  size={hp(5)}
                  color={Colors.cprimaryDark}
                />
                <Text className="rsfontSize-f-2 text-lightgreen">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileChangePhoto;
