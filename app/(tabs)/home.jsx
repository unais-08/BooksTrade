import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { SearchInput, Trending, EmptyState, BookCard } from "../../components";
import { useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import {
  generalOnRefresh,
  getAllPosts,
  getLatestPosts,
} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";
import { useRouter } from "expo-router";
const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch: refetchPosts } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    await generalOnRefresh(setRefreshing, refetchLatestPosts, refetchPosts);
  };
  const router = useRouter(); // Use Expo Router's navigation
  return (
    <SafeAreaView className="bg-primary h-full">
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
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-xl font-psemibold tracking-wider text-white">
                  {user?.username.toUpperCase()}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput title="Search for the Book Title" />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Trade Posts
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>

            <View className="w-full mt-4">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Explore
              </Text>
            </View>
          </View>
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
