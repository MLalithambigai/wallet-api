import { useAuth, useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,Image,  TouchableOpacity
} from "react-native";
import { styles as authStyles } from "../../../assets/styles/auth.styles";
import { COLORS } from "../../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function SignInScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    setErrorMessage("");

    try {
      const { error } = await signIn.password({ emailAddress, password });
      if (error) {
        setErrorMessage(error.message || "Unable to sign in. Please try again.");
        return;
      }

      if (signIn.status === "complete") {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          setErrorMessage(
            finalizeError.message || "Unable to finish signing in. Please try again."
          );
        }
        return;
      }

      setErrorMessage(
        "This account requires an additional verification step. This sign-in screen currently supports email and password only."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in. Please try again."
      );
    }
  };

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <KeyboardAwareScrollView style={{flex:1}}
    contentContainerStyle={{flexGrow:1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={100}>
      <View style={authStyles.container}>
      <Image source={require('@/assets/images/revenue-i4.png')}  style={authStyles.illustration} />
      <Text style={authStyles.title}>Welcome Back</Text>

       {errorMessage ? (
          <View style={authStyles.errorBox} accessibilityRole="alert">
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={authStyles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => setErrorMessage("")}
              accessibilityRole="button"
              accessibilityLabel="Dismiss error"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color={COLORS.expense} />
            </TouchableOpacity>
          </View>
        ) : null}


      <TextInput
              style={[authStyles.input, errorMessage && authStyles.errorInput]}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              placeholderTextColor="#9A8478"
              onChangeText={(email)=>setEmailAddress(email)}
            />


      <TextInput
              style={[authStyles.input, errorMessage && authStyles.errorInput]}
              value={password}

              placeholder="Enter password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={(password)=>setPassword(password)}
              />

      <TouchableOpacity style={authStyles.button} onPress={handleSignIn}>
              <Text style={authStyles.buttonText
              }>Sign in</Text>
            </TouchableOpacity>

      <View style={authStyles.footerContainer}>
              <Text style={authStyles.footerText}>Don&apos;t have an account? </Text>

              <Link href="/sign-up" asChild>
              <TouchableOpacity onPress={()=>router.back()}>
                <Text style={authStyles.linkText}>Sign up</Text>
              </TouchableOpacity>
              </Link>
            </View>


      </View>
    </KeyboardAwareScrollView>
  );
}