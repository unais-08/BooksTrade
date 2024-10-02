import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SearchInput, EmptyState, BookCard } from "../../components";
import { useEffect, useState } from "react";
import useAppwrite from "../../lib/useAppwrite";
import { searchPost } from "../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: posts, refetch } = useAppwrite(() => searchPost(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        // data={[]} when data is not show empty state {by unais..}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <BookCard book={item} />
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">{query}</Text>
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
