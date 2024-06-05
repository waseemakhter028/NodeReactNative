import React from 'react';
import {Modal} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../constants/Colors';
import {fp} from '../helpers/responsive';
import {Pressable, Text, TextInput, TouchableOpacity, View} from '../storybook';
import {NotesModalProps} from '../types';

const NotesModal = ({
  modalOpen,
  setModalOpen,
  notes,
  setNotes,
  Toast,
}: NotesModalProps) => {
  const saveNotes = () => {
    if (notes === '') {
      Toast('danger', 'Error !', 'Please enter notes');
      return false;
    }
    setModalOpen(false);
  };
  return (
    <Modal visible={modalOpen} transparent={true}>
      <View className="flex-1 justify-center items-center">
        <View className="rswidth-w-90 bg-border rspadding-w-5 rsborderRadius-w-5">
          <View className="justify-end items-end">
            <Pressable onPress={() => setModalOpen(false)}>
              <AntDesign
                name="closecircleo"
                size={fp(3)}
                color={Colors.cblue}
              />
            </Pressable>
          </View>
          <View className="rspaddingTop-h-3">
            <Text className="text-cblue font-bold rsfontSize-f-2 rspadding-w-1.5">
              Enter Order Notes
            </Text>
            <TextInput
              placeholder="Enter Notes"
              maxLength={30}
              placeholderTextColor={Colors.cblue}
              autoCapitalize="none"
              onChangeText={(text: string) => setNotes(text)}
              className="bg-white rounded-full rsheight-h-6 rsfontSize-f-2 rspaddingHorizontal-w-5 placeholder-cblue"
            />
          </View>
          {/* submit  button */}
          <View className="rspaddingTop-h-3">
            <TouchableOpacity
              className="bg-cblue rounded-full rspadding-w-3.5"
              onPress={() => saveNotes()}>
              <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotesModal;
