import { View, Image, Text } from "react-native-animatable";

import { TouchableOpacity } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const ChatHeader = ({
  receiverName,
  receiverAvatar,
  showBackButton = false,
}) => {
  const navigation = useNavigation();

  return (
    <View className="flex flex-row items-center p-2 bg-white">
      <View className="flex-row items-center justify-between bg-white p-1 shadow-lg ">
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ArrowLeftIcon size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <Image
        source={{ uri: receiverAvatar }}
        // source={images.logoSmall}
        className="w-10 h-10 rounded-full mr-2 "
      />
      <Text className="text-lg font-bold ">{receiverName}</Text>
    </View>
  );
};

export default ChatHeader;
