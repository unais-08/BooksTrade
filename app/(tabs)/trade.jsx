import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchTradeRequests, handleUpdateStatus } from "../../lib/appwrite"; // Adjust the import based on your structure
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomeHeader from "../../components/CustomeHeader";
import { Try } from "expo-router/build/views/Try";

const TradeRequestsScreen = () => {
  const [tradeRequests, setTradeRequests] = useState([]);

  const { user } = useGlobalContext();

  //   console.log(user);
  const getTradeRequests = async () => {
    if (user?.$id) {
      // Check if user is logged in
      try {
        const requests = await fetchTradeRequests(user?.username); // Assuming user.$id is the ownerName
        // Handle the fetched trade requests (e.g., set state)
        setTradeRequests(requests);
      } catch (error) {
        console.error("Error fetching trade requests:", error);
      }
    } else {
      console.log("User  is not logged in, skipping fetch.");
      setTradeRequests([]); // Optionally clear trade requests if user is logged out
    }

    const requests = await fetchTradeRequests(user?.username);
    setTradeRequests(requests);
  };
  useEffect(() => {
    getTradeRequests();
  }, [user?.$id]);

  //   console.log(tradeRequests);

  const updateTradeStatus = async (documentId, bookID, newStatus) => {
    await handleUpdateStatus(documentId, bookID, newStatus); // Your function to update status in the database
    getTradeRequests(); // Refetch trade requests after status update
  };
  const renderTradeRequest = ({ item }) => (
    <View className="bg-white px-5 py-2 rounded-sm shadow-lg border border-gray-200">
      <View className="flex-row items-center mb-2">
        <Image
          source={{ uri: user?.avatar }}
          className="w-8 h-8 rounded-full mr-3"
        />
        <Text className="text-base font-psemibold text-black-100">
          {item.requesterName}
        </Text>
      </View>
      <Text className="text-sm text-gray-600 mb-1">
        Requested a trade for the book:
      </Text>
      <Text className="text-lg font-bold text-blue-600 mb-2 tracking-wider capitalize">
        {item.bookTitle}
      </Text>
      <View className="flex-row items-center mb-4">
        <View
          className={`w-3 h-3 rounded-full mr-2  ${
            item.status === "Pending"
              ? "bg-yellow-500"
              : item.status === "Accepted"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
        <Text className="text-sm text-black-100 tracking-wide">
          Current Status: {item.status}
        </Text>
      </View>
      {item.status === "Pending" && (
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => updateTradeStatus(item.$id, item.bookID, "Accepted")}
            className="px-4 py-2 bg-green-500 rounded-lg shadow-md flex-1 mr-2"
          >
            <Text className="text-white text-center font-semibold">
              Approve Trade
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateTradeStatus(item.$id, item.bookID, "Rejected")}
            className="px-4 py-2 bg-red-600 rounded-lg shadow-md flex-1"
          >
            <Text className="text-white text-center font-semibold">
              Decline Trade
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CustomeHeader title="Trade Requests" showBackButton={true} />
      <FlatList
        data={tradeRequests}
        renderItem={renderTradeRequest}
        keyExtractor={(item) => item.$id}
        // contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <Text className="text-lg text-gray-600 text-center">
              No trade requests found. When you receive requests, they'll appear
              here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TradeRequestsScreen;
