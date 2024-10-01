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
import Card from "../../components/Card";
const DetailsScreen = () => {
  const { bookId } = useLocalSearchParams(); // Access bookId from the query parameters
  //   const [bookData, setBookData] = useState(null);
  const { data: bookDetails, loading } = useAppwrite(() =>
    getBookDetails(bookId)
  ); // Fetch book details using the bookId, or display it directly
  const {
    title,
    author,
    coverImage,
    genre,
    description,
    language,
    creator,
    avatar,
  } = bookDetails || {};
  return (
    <SafeAreaView className="flex-1">
      <Card
        title={title}
        author={author}
        coverImage={coverImage}
        genre={genre}
        description={description}
        language={language}
        username={creator?.username}
        avatar={creator?.avatar}
      />
    </SafeAreaView>
  );
};

export default DetailsScreen;
