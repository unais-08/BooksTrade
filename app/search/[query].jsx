import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchInput, EmptyState, BookCard } from "../../components";
import { useEffect } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { searchPost } from "../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch } = useAppwrite(() => searchPost(query));
  const navigation = useNavigation();
  useEffect(() => {
    refetch();
  }, [query]);
  const router = useRouter(); // Use Expo Router's navigation
  return (
    <SafeAreaView className="bg-grey-50 h-full">
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
        <ArrowLeftIcon size={24} color="black" />
      </TouchableOpacity>
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
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-black-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-black">{query}</Text>
            <View className="mt-6 mb-8">
              <SearchInput title="Search for the Books" initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Book Found"
            subtitle="No Books found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
