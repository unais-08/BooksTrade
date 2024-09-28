import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, BookCard, InfoBox } from "../../components";

import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import { Image } from "react-native-animatable";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        // data={[]} when data is not show empty state {by unais..}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <BookCard book={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image source={icons.logout} className="w-6 h-6" />
            </TouchableOpacity>
            <View className="w-16 h-16 border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg uppercase"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="You haven't uploaded yet. Start Trade now!"
            subtitle="No Books Uploaded"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
