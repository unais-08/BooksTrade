import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  View,
  SafeAreaView,
  RefreshControl,
} from "react-native";

import {
  generalOnRefresh,
  getConnectedUsers,
  getUsersByIds,
  subscribeToMessages,
} from "../../lib/appwrite"; // Function to get connected users
import { useGlobalContext } from "../../context/GlobalProvider"; // Global context for user info
import { useRouter } from "expo-router"; // Router for navigation

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
            setUsers((prevUsers) => [...prevUsers, ...newUserDetails]);
            fetchedUserIds.add(newUserId); // Mark this user as fetched
          }
        } catch (error) {
          console.error("Error fetching new user details:", error);
        }
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [user?.$id, users]); //uncomment karna hai

  // Track fetched user IDs outside useEffect to persist across re-renders
  const fetchedUserIds = useRef(new Set());

  const defaultUser = {
    $id: 5665454544, // Unique ID for the default user
    username: "BookTrade Bot",
    avatar: `https://cloud.appwrite.io/v1/avatars/initials?name=Default User&project=66f64c2a0026e2fbaefc`, // URL for the default avatar
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 border-b border-gray-700"
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
    <SafeAreaView className="flex-1 bg-primary px-4 py-5">
      <View className="w-full py-3 border-b border-gray-700 mb-0">
        <Text className="text-xl font-bold text-white text-center">Chats</Text>
      </View>
      <FlatList
        data={usersToDisplay} // Use the usersToDisplay state
        renderItem={renderChatItem}
        keyExtractor={(item) => item.$id} // Ensure unique key
        showsVerticalScrollIndicator={false} // Hide scroll indicator for cleaner look
        initialNumToRender={7} // Render 7 users initially for performance
        contentContainerStyle={{ paddingBottom: 20 }} // Add space at the bottom
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default ChatListScreen;
