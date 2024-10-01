import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import CustomButton from "./CustomButton";

// Get screen width
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Card = ({
  title: t,
  author,
  coverImage,
  genre,
  description,
  language,
  username,
  avatar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fullText = `${description}`;
  const truncatedText = fullText.slice(0, 5);
  return (
    <View className="flex-1 items-center justify-center ">
      <View className="flex flex-row justify-start items-center gap-2 w-full mb-2  mt-7">
        <Image
          source={{ uri: avatar }}
          className="w-8 h-8 rounded-full"
          resizeMode="cover"
        />
        <Text className="font-psemibold text-sm  capitalize tracking-wide ">
          {username}
        </Text>
      </View>
      <View
        style={{ width: screenWidth * 0.9, height: screenHeight * 0.95 }}
        className=" rounded-lg shadow-lg "
      >
        {/* Image */}
        <View className="flex items-center justify-center">
          <Image
            source={{ uri: coverImage }}
            className="w-60 h-80 max-w-full max-h-80 rounded-lg"
            resizeMode="cover"
          />
        </View>
        <ScrollView
          style={{ flex: 1, marginTop: 10 }}
          contentContainerStyle={{ padding: 12 }}
        >
          {/* Title */}
          <Text className="text-2xl font-pmedium text-center capitalize text-gray-500 tracking-wide">
            {t}
          </Text>
          {/* author */}
          <Text className="text-sm font-pmedium text-gray-600 capitalize  mt-2">
            Author: {author}
          </Text>
          <Text className="text-sm font-pmedium text-gray-600">
            Genre: {genre}
          </Text>
          <Text className="text-sm font-pmedium text-gray-600">
            Language: {language}
          </Text>
          <Text className="text-sm font-pmedium text-gray-600">
            Uploaded By: {username}
          </Text>
          {/* Description */}
          <Text className="text-sm font-plight text-gray-600 text-justify mt-2">
            {/* {isExpanded ? fullText : `${truncatedText}...`} */}
            <Text className="text-sm font-pmedium text-gray-600">
              Description:
            </Text>{" "}
            {description} Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Voluptatem iste quod nihil natus iure perspiciatis in nam
            explicabo, doloremque sequi quasi deleniti minima tempore nostrum
            quam nemo mollitia dolorum repellendus adipisci ipsum placeat. Fuga
            minus assumenda voluptatibus necessitatibu
            
          </Text>
          <CustomButton title="Connect" containerStyles="mt-5  mb-5" />
        </ScrollView>
      </View>
    </View>
  );
};

export default Card;
