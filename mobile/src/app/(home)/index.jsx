import { useAuth, useUser } from "@clerk/expo";
import { Link } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import SignOutButton from "../../../components/SignOutButton";
import { useTransactions } from "../../../hooks/useTransaction";
import { useEffect } from "react";

export default function HomeScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { transactions, summary, errors, isLoading, loadData } =
    useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    console.log("userId:", user?.id);
    console.log("summary:", summary);
    console.log("transactions:", transactions);
    console.log("transactions loading:", isLoading);
    console.log("transactions API errors:", errors);
  }, [user?.id, summary, transactions, isLoading, errors]);

  if (!isLoaded) {
    return <ActivityIndicator accessibilityLabel="Loading account" />;
  }

  if (!isSignedIn) {
    return (
      <View>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    );
  }

  const emailAddress = user?.primaryEmailAddress?.emailAddress;

  return (
    <View>
      <Text>Hello {emailAddress || user?.firstName || "there"}</Text>
      <SignOutButton />
    </View>
  );
}
