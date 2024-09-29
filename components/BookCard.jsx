import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "../constants";
const BookCard = ({
  book: {
    title,
    coverImage,
    author,
    creator: { username, avatar },
  },
}) => {
  const [visit, setVisit] = useState(false);
  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row justify-start items-center gap-2 w-full mb-2 mt-7">
        <Image
          source={{ uri: avatar }} // Replace with actual avatar URL
          className="w-8 h-8 rounded-full"
          resizeMode="cover"
        />
        <Text className="font-psemibold text-sm text-white capitalize">
          {username} {/* Display the username here */}
        </Text>
      </View>
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[80px] h-[80px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: coverImage }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white capitalize"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular capitalize"
              numberOfLines={1}
            >
              {author}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {/* {visit ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setVisit(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setVisit(true)}
          className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: coverImage }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      {/* )} */}
    </View>
  );
};

export default BookCard;
