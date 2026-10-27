import { useClerk } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { styles as homeStyles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export default function SignOutButton() {
  const clerk = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    try {
      await clerk.signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";
      Alert.alert("Sign out failed", message);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Sign out"
      onPress={handleSignOut}
      disabled={isSigningOut}
      style={({ pressed }) => [
        homeStyles.logoutButton,
        styles.button,
        pressed && styles.pressed,
        isSigningOut && styles.disabled,
      ]}
    >
      {isSigningOut ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Text style={styles.label}>Sign out</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 80,
    alignItems: "center",
  },
  label: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.6,
  },
});