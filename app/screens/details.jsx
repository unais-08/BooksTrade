import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getBookDetails } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import Card from "../../components/Card";
import {  CustomeHeader } from "../../components";
import { createTradeRequest } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const DetailsScreen = () => {
  const { user } = useGlobalContext();
  const { bookId } = useLocalSearchParams(); // Access bookId from the query parameters;
  const { data: bookDetails } = useAppwrite(() => getBookDetails(bookId)); // Fetch book details using the bookId, or display it directly
  // console.log(bookDetails.creator.username);

  const { title, author, coverImage, genre, description, language, creator } =
    bookDetails || {};
  // console.log("loggedUserID :", user?.$id);
  console.log("Title :", title);
  // console.log("bookID :", bookId);
  // console.log("uploaderID :", creator?.$id);

  const connect = () => {
    const { username, avatar, $id } = creator;
    router.push(
      `/screens/chatScreen?userId=${$id}&username=${username}&avatar=${encodeURIComponent(
        avatar
      )}`
    );
  };

  const handleTradeRequest = async () => {
    try {
      const response = await createTradeRequest(
        user?.$id,
        user?.username,
        title,
        creator?.username,
        bookId
      );
      console.log("Trade request created:", response);
      alert("Trade request sent!");
    } catch (error) {
      console.error("Failed to initiate trade:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomeHeader title="Book Details" showBackButton={true} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
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
        {/* <CustomButton
          title="Trade Request"
          containerStyles="bg-none"
          textStyles="font-plight text-base"
          handlePress={handleTradeRequest}
        /> */}
      </ScrollView>
      {/* fixed buttons */}
      
        <View className="relative">
          <View className="fixed bottom-0 left-0 right-0 flex-row justify-between p-3 bg-white">
            <TouchableOpacity
              className="flex-1 mr-2 rounded-md bg-white border border-green-500  items-center justify-center py-3"
              onPress={connect}
            >
              <Text className="text-green-500 font-bold text-base uppercase">
                Connect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 ml-2  bg-green-500 rounded-md items-center justify-center py-3"
              onPress={handleTradeRequest}
            >
              <Text className="text-white font-bold text-base uppercase">
                Trade Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
    </SafeAreaView>
  );
};

export default DetailsScreen;
