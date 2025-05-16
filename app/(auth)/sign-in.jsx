import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from "react-native";

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
  const router = useRouter();

  const submit = async () => {
    if (form.email.trim() === "" || form.password.trim() === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      setTimeout(() => {
        router.replace("/home");
      }, 100); // 100ms delay
    } catch (error) {
      Alert.alert("Error", error?.message || "Something went wrong");
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
          <Text className="text-2xl font-pmedium text-gray-800 mt-10 text-center">
            BooKTrade
          </Text>

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
              href="/forgot-password"
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
