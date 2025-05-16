import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { CustomButton } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();
  console.log("Context", isLogged);
  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-gray-900 h-full">
      {/* <Loader isLoading={loading} /> */}

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <View className="relative mt-5">
          <Text className="text-3xl text-white font-pmedium text-center">
            Innovating the Future {"\n"}
            of Book Distribution.{"\n"}
            <Text className="text-teal-400">BookTrade</Text>
          </Text>

          {images.path && (
            <Image
              source={images.path}
              className="w-[150px] h-[20px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          )}
        </View>

        <Text className="text-md font-light text-gray-300 mt-7 text-center">
          Where Creativity Meets Innovation: Embark on a Journey of Limitless
          Exploration with BookTrade
        </Text>

        <CustomButton
          title="Continue with Email"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-full mt-7 bg-teal-600 rounded-lg shadow-md"
        />
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
