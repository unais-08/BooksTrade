import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { fetchTradeRequests, handleUpdateStatus } from "../../lib/appwrite"; // Adjust the import based on your structure
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import TradeHeader from "../../components/TradeHeader";

const TradeRequestsScreen = () => {
  const [tradeRequests, setTradeRequests] = useState([]);

  const { user } = useGlobalContext();

  //   console.log(user);
  const getTradeRequests = async () => {
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
    <View className="flex-row items-start p-4 mb-4 bg-white rounded-lg shadow-lg">
      <Image
        source={{ uri: user?.avatar }}
        className="w-16 h-16 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="text-lg font-semibold">{item.requesterName}</Text>
        <Text className="font-sm">Made Trade Request For Book</Text>
        <Text className="text-gray-500 text-base">{item.bookTitle}</Text>
        <Text className="mt-1 text-gray-400">Status: {item.status}</Text>
      </View>
      <View className="flex-col justify-center items-end space-y-2">
        {item.status === "Pending" && (
          <>
            {/* Accept Button */}
            <TouchableOpacity
              onPress={() =>
                updateTradeStatus(item.$id, item.bookID, "Accepted")
              }
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              <Text className="text-white text-center">Accept</Text>
            </TouchableOpacity>

            {/* Reject Button */}
            <TouchableOpacity
              onPress={() =>
                updateTradeStatus(item.$id, item.bookID, "Rejected")
              }
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              <Text className="text-white text-center">Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="w-full  h-full bg-gray-100">
      <TradeHeader title="Trade Requests" showBackButton={true} />
      <FlatList
        data={tradeRequests}
        renderItem={renderTradeRequest}
        keyExtractor={(item) => item.$id} // Assuming $id is the unique identifier
        contentContainerStyle={{ paddingBottom: 16 }} // If you need additional padding at the bottom
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text>No trade requests found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default TradeRequestsScreen;
