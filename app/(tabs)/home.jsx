import { View, Text } from "react-native";

import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuthenticatedUser } from "../../lib/appwrite";
const Home = () => {
  const [username, setUsername] = useState(null);
  const [userEmail, setEmail] = useState(null);
  const [Id, setId] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthenticatedUser();
      if (user) {
        setUsername(user.name);
        setEmail(user.email);
        setId(user.$id);
      }
    };

    fetchUser();
  }, []);
  return (
    <SafeAreaView>
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl">Home (tabs)</Text>
        {username ? (
          <Text className="text-md text-center font-pbold text-green-800">
            Welcome, {username} you have register with {userEmail} {"\n"} In
            Appwrite your ID is {"\n"} {Id}
          </Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
