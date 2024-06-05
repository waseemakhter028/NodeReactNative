import React from 'react';
import {Modal} from 'react-native';

import {Text, TouchableOpacity, View} from '../storybook';
import {DeleteModalProps} from '../types';

const DeleteModal = ({
  modalOpen,
  setModalOpen,
  handleDelete,
  message,
}: DeleteModalProps) => {
  return (
    <Modal visible={modalOpen} transparent>
      <View className="flex-1 justify-center items-center">
        <View className="rswidth-w-90 bg-border rspadding-w-5 rsborderRadius-w-5">
          <Text className="rsfontSize-f-3 text-cred">Confirm !!</Text>

          <View className="rspaddingTop-h-2">
            <Text className="rsfontSize-f-2 text-cblue">{message}</Text>
          </View>

          <View className="rspaddingTop-h-3 flex-row justify-end rsgap-w-5">
            <TouchableOpacity
              className="bg-cred rounded-full justify-center rsheight-h-4.5 rswidth-w-25"
              onPress={() => setModalOpen(false)}>
              <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-cblue rounded-full justify-center rsheight-h-4.5 rswidth-w-25"
              onPress={handleDelete}>
              <Text className="text-center rsfontSize-f-2.5 font-bold text-white">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;
