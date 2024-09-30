import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { getBookDetails } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
const DetailsScreen = () => {
  const { bookId } = useLocalSearchParams(); // Access bookId from the query parameters
  //   const [bookData, setBookData] = useState(null);
  const { data: bookDetails, loading } = useAppwrite(() =>
    getBookDetails(bookId)
  ); // Fetch book details using the bookId, or display it directly
  const { title, author, coverImage,genre,description,language ,creator } = bookDetails || {};
  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Loader */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          {/* Show loading spinner */}
        </View>
      )}

      {/* Book Details */}
      {bookDetails && (
        <ScrollView className="flex-1">
          {/* Cover Image */}
          <ImageBackground
            source={{
              uri: coverImage,
            }}
            className="w-80 h-80 rounded-[15px] my-5  shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          {/* Book Info */}
          <View className="p-6">
            {/* Title */}
            <Text className="text-3xl font-semibold text-white mb-4">
              {title}
            </Text>

            {/* Author */}
            <Text className="text-xl text-gray-300 mb-2">Author: {author}</Text>

            {/* Creator */}
            <Text className="text-lg text-gray-400">
              Uploaded by: {creator?.username}
            </Text>
            <Text className="text-lg text-gray-400">
              genre : {genre}
            </Text>
            <Text className="text-lg text-gray-400">
              Language of book : {language}
            </Text>
            <Text className="text-lg text-gray-400">
              Description: {description}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DetailsScreen;
