import { Ionicons } from "@expo/vector-icons";
import { useAuth, useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,Image,
} from "react-native";
import { styles as authStyles } from "@/assets/styles/auth.styles.js";
import { COLORS } from "@/constants/colors.js";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MIN_PASSWORD_LENGTH = 6;

export default function SignUpScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmitting = fetchStatus === "fetching";

  const handleSignUp = async () => {
    setErrorMessage("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
      );
      return;
    }

    try {
      const { error } = await signUp.password({ emailAddress, password });
      if (error) {
        setErrorMessage(
          error.message || "Unable to create your account. Please try again."
        );
        return;
      }

      const { error: sendError } =
        await signUp.verifications.sendEmailCode();
      if (sendError) {
        setErrorMessage(
          sendError.message ||
            "Unable to send a verification code. Please try again."
        );
        return;
      }

      setIsVerifying(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again."
      );
    }
  };

  const handleVerify = async () => {
    setErrorMessage("");

    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code });
      if (error) {
        setErrorMessage(
          error.message || "That verification code is invalid. Please try again."
        );
        return;
      }

      const { error: finalizeError } = await signUp.finalize();
      if (finalizeError) {
        setErrorMessage(
          finalizeError.message ||
            "Unable to finish signing up. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to verify your email. Please try again."
      );
    }
  };

  const handleResendCode = async () => {
    setErrorMessage("");

    try {
      const { error } = await signUp.verifications.sendEmailCode();
      if (error) {
        setErrorMessage(
          error.message ||
            "Unable to send a new code. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to send a new code. Please try again."
      );
    }
  };

  if (!isLoaded || isSignedIn) {
    return null;
  }

  if (isVerifying) {
    return (
      <View style={authStyles.verificationContainer}>
        <Text style={authStyles.verificationTitle}>Verify your mail</Text>

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
          style={[authStyles.verificationInput, errorMessage && authStyles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={COLORS.textLight}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
          accessibilityLabel="Email verification code"
        />
        <TouchableOpacity
           style={authStyles.button}
          onPress={handleVerify}>
            <Text style={authStyles.buttonText}>Verify</Text>

          </TouchableOpacity>



      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={{flex:1}}
    contentContainerStyle={{flexGrow:1}}
    enableOnAndroid={true}
    enableAutomaticScroll={true}
    extraScrollHeight={100}>
      <View style={authStyles.container}>
        <Image source={require('@/assets/images/revenue-i2.png')}  style={authStyles.illustration} />
      <Text style={authStyles.title}>Create your account</Text>

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

        placeholder="Password (at least 6 characters)"
        placeholderTextColor="#9A8478"
        secureTextEntry={true}
        onChangeText={(password)=>setPassword(password)}
        />

      <TouchableOpacity style={authStyles.button} onPress={handleSignUp}>
        <Text style={authStyles.buttonText
        }>Sign Up</Text>
      </TouchableOpacity>

      <View style={authStyles.footerContainer}>
        <Text style={authStyles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={()=>router.back()}>
          <Text style={authStyles.linkText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAwareScrollView>
  );
}

const screenStyles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
