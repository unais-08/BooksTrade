import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchInput, Trending, EmptyState, BookCard } from "../../components";
import { useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import {
  generalOnRefresh,
  getAllPosts,
  getLatestPosts,
} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from "expo-router";
const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch: refetchPosts } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  // console.log(posts);
  const onRefresh = async () => {
    await generalOnRefresh(setRefreshing, refetchLatestPosts, refetchPosts);
  };

  const router = useRouter(); // Use Expo Router's navigation
  return (
    <SafeAreaView className=" bg-gray-50 h-full">
      <FlatList
        data={posts}
        // data={[]} when data is not show empty state {by unais..}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/screens/details?bookId=${item.$id}`)}
          >
            <BookCard book={item} />
          </TouchableOpacity>
        )}
        // header component
        ListHeaderComponent={() => (
          <View className="flex my-1 px-3">
            <View className="flex justify-between items-start flex-row mb-3">
              <View className="mt-2">
                <Text className="font-pregular text-xs text-black-100">
                  Welcome
                </Text>
                <Text className="text-base font-pmedium tracking-wider text-black-100">
                  {user?.username.toUpperCase()}
                </Text>
              </View>
            </View>

            <SearchInput title="Search for the Book Title" />

            <View className="w-full flex-1 pt-5 pb-0">
              <Text className="text-lg font-pmedium  text-black-200 mb-1">
                Latest Trade Posts
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>

            <View className="w-full ">
              <Text className="text-lg font-pmedium  text-black-200 mb-2">
                Explore
              </Text>
            </View>
          </View>
          // header component ends here
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Book Found" subtitle="No Books uploaded yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
