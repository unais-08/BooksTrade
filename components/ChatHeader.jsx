import React from "react";
import { View, Image, Text } from "react-native-animatable";
import { images } from "../constants";

const ChatHeader = ({ receiverName, receiverAvatar }) => {
  
  
  return (
    <View className="flex flex-row items-center p-4">
      <Image
        source={{ uri: receiverAvatar  }}
        // source={images.logoSmall}
        className="w-10 h-10 rounded-full mr-2 bg-authColor"
      />
      <Text className="text-lg font-bold ">{receiverName}</Text>
    </View>
  );
};

export default ChatHeader;
