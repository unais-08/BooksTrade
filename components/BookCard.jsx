import { useState } from "react";
import { View, Text, Image } from "react-native";
import { icons } from "../constants";
const BookCard = ({ book: { title, coverImage, author, creator } }) => {
  const [visit, setVisit] = useState(false);
  // console.log(creator?.username);
  return (
    <View className="flex flex-col items-center px-4 mb-1">
      <View className="flex flex-row justify-start items-center gap-2 w-full mb-2 mt-5">
        <Image
          source={{ uri: creator?.avatar }} // Replace with actual avatar URL
          className="w-8 h-8 rounded-full"
          resizeMode="cover"
        />
        <Text className="font-psemibold text-sm text-white capitalize">
          {creator?.username}
        </Text>
      </View>
      {/* actual book image and name in bookCard is here */}
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[100px] h-[120px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: coverImage }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-base text-white capitalize"
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
    </View>
  );
};

export default BookCard;
