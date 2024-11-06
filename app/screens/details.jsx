import { View, Text, Image, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getBookDetails } from "../../lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import useAppwrite from "../../lib/useAppwrite";
import Card from "../../components/Card";
import { CustomButton,TradeHeader } from "../../components";
import { createTradeRequest } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const DetailsScreen = () => {
  const { user } = useGlobalContext();
  const { bookId } = useLocalSearchParams(); // Access bookId from the query parameters;
  const { data: bookDetails, loading } = useAppwrite(() =>
    getBookDetails(bookId)
  ); // Fetch book details using the bookId, or display it directly
  // console.log(bookDetails.creator.username);

  const { title, author, coverImage, genre, description, language, creator } =
    bookDetails || {};
  console.log("loggedUserID :", user?.$id);
  console.log("Title :", title);
  console.log("bookID :", bookId);
  console.log("uploaderID :", creator?.$id);

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
    <SafeAreaView className="flex-1">
      <TradeHeader title="Book Details" showBackButton={true}/>
      <View className="flex-row items-center justify-between p-2 shadow-lg bg-white rounded-lg">
        <View className="flex-row items-center gap-2">
          {creator?.avatar && (
            <Image
              source={{ uri: creator?.avatar }}
              className="w-8 h-8 rounded-full"
              resizeMode="cover"
            />
          )}
          {creator?.username && (
            <Text className="font-psemibold text-sm capitalize tracking-wide">
              {creator?.username}
            </Text>
          )}
        </View>
        <CustomButton
          title="Connect"
          containerStyles="w-[100px] min-h-[25px] bg-none"
          textStyles="font-plight text-base"
          handlePress={connect}
        />
      </View>

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
        <CustomButton
          title="Trade Request"
          containerStyles="bg-none"
          textStyles="font-plight text-base"
          handlePress={handleTradeRequest}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailsScreen;
