import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View
          className="w-full flex justify-center h-full px-6 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          {/* <Image
          source={images.bookLogo}
          resizeMode="contain"
          className="w-[150px] h-[80px] self-center"
        /> */}

          <Text className="text-2xl font-pmedium text-gray-800 mt-10 text-center">
            BooKTrade
          </Text>

          {/* <Text className="text-lg text-gray-600 text-center mt-2">
            Log in to your account
          </Text> */}

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
            placeholder="Enter your password"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7 bg-blue-600 rounded-xs"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-base text-gray-600">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-base font-semibold text-blue-600 tracking-wider"
            >
              Register
            </Link>
          </View>

          <View className="flex justify-center pt-5">
            <Link
              href="/sign-up"
              className="text-base font-semibold text-blue-600 text-center tracking-wider"
            >
              Forgot Password?
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
