import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchTradeRequests, handleUpdateStatus } from "../../lib/appwrite"; // Adjust the import based on your structure
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomeHeader from "../../components/CustomeHeader";

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
    <View className="bg-white px-5 py-4 rounded-lg shadow-md border border-gray-300 mb-4">
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: user?.avatar }}
          className="w-6 h-6 rounded-full mr-2"
        />
        <Text className="text-base font-pmedium text-gray-800">
          {item.requesterName}
        </Text>
      </View>
      <View className="mb-1">
        <Text className="text-sm text-gray-500 mb-1">
          Requested a trade for:
        </Text>
        <Text className="text-lg font-semibold text-indigo-800 mb-2 tracking-wide capitalize">
          {item.bookTitle}
        </Text>
      </View>
      <View className="flex-row items-center mb-4">
        <View
          className={`w-3 h-3 rounded-full mr-2 ${
            item.status === "Pending"
              ? "bg-yellow-500"
              : item.status === "Accepted"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
        <Text className="text-sm text-gray-800 tracking-wide">
          Current Status: {item.status}
        </Text>
      </View>
      {item.status === "Pending" && (
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => updateTradeStatus(item.$id, item.bookID, "Accepted")}
            className="px-4 py-2 bg-blue-600 rounded-lg shadow-md flex-1 mr-2"
          >
            <Text className="text-white text-center font-semibold">
              Approve Trade
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateTradeStatus(item.$id, item.bookID, "Rejected")}
            className="px-4 py-2 bg-red-500 rounded-lg shadow-md flex-1"
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
        contentContainerStyle={{ padding: 16 }}
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
