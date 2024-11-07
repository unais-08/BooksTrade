import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  View,
  SafeAreaView,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";

import {
  generalOnRefresh,
  getConnectedUsers,
  getUsersByIds,
  subscribeToMessages,
} from "../../lib/appwrite"; // Function to get connected users
import { useGlobalContext } from "../../context/GlobalProvider"; // Global context for user info
import { useRouter } from "expo-router"; // Router for navigation
import { CustomeHeader, SearchInput } from "../../components";
import { StatusBar } from "expo-status-bar";

const ChatListScreen = () => {
  const { user } = useGlobalContext(); // Get logged-in user info from global context
  if (!user) return;
  const router = useRouter(); // Get router for navigation
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    await generalOnRefresh(fetchConnectedUsers);
  };

  const fetchConnectedUsers = async () => {
    try {
      const initialUsers = await getConnectedUsers(user?.$id); // userId from context
      setUsers(initialUsers);
    } catch (error) {
      console.error("Error fetching connected users:", error);
    }
  };

  useEffect(() => {
    console.log("from chatsList.jsx...");
    const fetchedUserIds = new Set(); // Track already fetched user IDs

    // Fetch initial connected users when the component mounts
    fetchConnectedUsers();

    // Subscribe to new messages
    const unsubscribe = subscribeToMessages(async (newMessage) => {
      const newUserId =
        newMessage.senderID !== user?.$id
          ? newMessage.senderID
          : newMessage.receiverID;

      // Check if the new user is already in the list or has been fetched before
      if (
        !fetchedUserIds.has(newUserId) &&
        !users.some((u) => u.$id === newUserId)
      ) {
        try {
          const newUserDetails = await getUsersByIds([newUserId]);
          if (newUserDetails.length > 0) {
            setUsers((prevUsers) => {
              // Ensure no duplicates by checking if the user is already added
              const isAlreadyAdded = prevUsers.some(
                (u) => u.$id === newUserDetails[0].$id
              );
              if (!isAlreadyAdded) {
                fetchedUserIds.add(newUserDetails[0].$id);
                return [...prevUsers, newUserDetails[0]];
              }
              return prevUsers;
            });
          }
        } catch (error) {
          console.error("Error adding new user from subscription:", error);
        }
      }
    });

    // Cleanup the subscription on unmount
    return () => {
      console.log("unsubscribe from ...chatsList.jsx");
      unsubscribe();
    };
  }, [user]); //uncomment karna hai

  const defaultUser = {
    $id: 5665454544, // Unique ID for the default user
    username: "BookTrade Bot",
    avatar: `https://cloud.appwrite.io/v1/avatars/initials?name=Default User&project=66f64c2a0026e2fbaefc`, // URL for the default avatar
  };
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
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
        source={{ uri: item?.avatar }}
        className="w-14 h-14 rounded-full"
        resizeMode="cover"
      />
      {/* Username and Last Message */}
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {item?.username || "UNKNOWN USER"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1" numberOfLines={1}>
          Last message preview...
        </Text>
      </View>
      {/* Time */}
      <Text className="text-xs text-gray-500">12:30 PM</Text>
    </TouchableOpacity>
  );

  const usersToDisplay = users.length > 0 ? users : [defaultUser];

  return (
    <View className="flex-1 bg-gray-50 mt-5">
      <SafeAreaView className="">
        <View className="z-10 bg-white shadow-sm pt-2">
          {Platform.OS === "android" && (
            <StatusBar backgroundColor="white" barStyle="dark-content" />
          )}
          <CustomeHeader title="Chats List" showBackButton={true} />
          {/* Search Bar */}
          <View className="px-4 py-2">
            <SearchInput title="Search Chat" />
          </View>
        </View>
        <FlatList
          data={usersToDisplay}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.$id}
          showsVerticalScrollIndicator={false}
          initialNumToRender={7}
          contentContainerStyle={{ paddingTop: 2 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default ChatListScreen;
