{/* <View className="flex-row items-center justify-between p-2 shadow-lg bg-white rounded-lg">
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
      </View> */}

























      const renderTradeRequest = ({ item }) => (
        <View className="  flex-row items-start bg-gray-50 p-4 mb-4 rounded-lg shadow-lg">
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
          <CustomeHeader title="Trade Requests" showBackButton={true} />
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










































const renderChatItem = ({ item }) => (
  <TouchableOpacity
    className="flex-row items-center border-b border-gray-700"
    onPress={() =>
      router.push(
        `/screens/chatScreen?userId=${item.$id}&username=${
          item.username
        }&avatar=${encodeURIComponent(item.avatar)}`
      )
    }
  >
    {/* User Profile Image */}
    <Image
      source={{ uri: item?.avatar }} // Ensure the correct format
      className="w-12 h-12 rounded-full"
      resizeMode="contain"
    />
    {/* Username */}
    <View className="ml-4">
      <Text className="text-lg font-semibold text-white">
        {item?.username || "UNKNOWN USER"}
      </Text>
      {/* Placeholder for last message or other info */}
      {/* <Text className="text-sm text-gray-200">Last message preview</Text> */}
    </View>
  </TouchableOpacity>
);
const usersToDisplay = users.length > 0 ? users : [defaultUser];
return (
  <SafeAreaView className="flex-1 bg-grey-50 justify-center">
    <CustomeHeader />
    <FlatList
      data={usersToDisplay} // Use the usersToDisplay state
      renderItem={renderChatItem}
      keyExtractor={(item) => item.$id} // Ensure unique key
      showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
      initialNumToRender={7} // Render 7 users initially for performance
      // contentContainerStyle={{ paddingBottom: 20 }} // Add space at the bottom
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  </SafeAreaView>
);