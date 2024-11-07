import { useState } from "react";
import { View, Text, Image } from "react-native";
import { icons } from "../constants";
const BookCard = ({
  book: { title, coverImage, author, creator },
  flag = true,
}) => {
  const [visit, setVisit] = useState(false);
  // console.log(creator?.username);mb-3
  return (
    // I have to add shadow on bookimage name section remove form main container shadow (shadow-xl)
    <View className="bg-white flex flex-col items-center mb-1">
      {/* Book image and name */}
      <View className="flex flex-row w-full gap-2 items-start pb-2 pt-4 mt-1 shadow-sm shadow-gray-400 ">
        <View className="flex justify-center items-center mr-2">
          <View className="w-[100px] h-[140px]  overflow-hidden">
            <Image
              source={{ uri: coverImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Title and author name and user who upload it profile*/}
        <View className="flex-1">
          {flag && (
            <View className="flex flex-row justify-start items-center gap-2 mb-5  ">
              <Image
                source={{ uri: creator?.avatar }} // Replace with actual avatar URL
                className="w-6 h-6 rounded-full border border-gray-200"
                resizeMode="cover"
              />
              <Text className="font-plight text-xs text-gray-800 capitalize tracking-wider">
                {creator?.username}
              </Text>
            </View>
          )}
          <View className="flex gap-1">
            <Text className="font-psemibold text-lg text-black-200 capitalize tracking-wider">
              {title}
            </Text>
            <Text className="text-xs  text-black-200 font-plight uppercase tracking-wider">
              By: {author}
            </Text>
          </View>
        </View>

        {/* menu icon :3dots icons */}
        <View className="pt-0">
          <Image
            source={icons.menu}
            className="w-3 h-3"
            resizeMode="contain"
            style={{ tintColor: "black" }}
          />
        </View>
      </View>
    </View>
  );
};

export default BookCard;
