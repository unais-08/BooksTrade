import { View, Text, Image } from "react-native";

const Card = ({
  title,
  author,
  coverImage,
  genre,
  description,
  language,
  username,
}) => {
  //make flipkart style button
  return (
    // items-center justify-center in this div have this css so if any problem occurs test this first
    <View className="flex-1 mt-3">
      {/* Main Card Body */}

      {/* Cover Image */}
      <View className="ml-2">
        {title && (
          <Text className="text-lg font-pmedium uppercase text-black-100 tracking-tighter">
            {title}
          </Text>
        )}
        {author && (
          <Text className="text-sm font-pregular text-bluish-DEFUALT capitalize tracking-tighter">
            By : {author}
          </Text>
        )}
      </View>
      <View className="flex items-center justify-center  ">
        {coverImage && (
          <Image
            source={{ uri: coverImage }}
            className="w-60 h-80 max-w-full max-h-80 rounded-lg mt-2"
            resizeMode="cover"
          />
        )}
      </View>

      {/* Card Content */}
      <View className="p-4">
        {title && (
          <Text className="text-2xl font-pmedium text-center capitalize text-gray-500 tracking-wider">
            {title}
          </Text>
        )}
        {author && (
          <Text className="text-sm font-pmedium text-gray-600 capitalize mt-2">
            Author: {author}
          </Text>
        )}
        {genre && (
          <Text className="text-sm font-pmedium text-gray-600">
            Genre: {genre}
          </Text>
        )}
        {language && (
          <Text className="text-sm font-pmedium text-gray-600">
            Language: {language}
          </Text>
        )}
        {username && (
          <Text className="text-sm font-pmedium text-gray-600">
            Uploaded By: {username}
          </Text>
        )}

        {/* Description */}

        {description && (
          <>
            <Text className="text-sm font-pmedium text-gray-600 mt-1">
              Description:
            </Text>
            <Text className="text-sm font-plight text-gray-600 text-justify mt-2">
              {description}
            </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default Card;
