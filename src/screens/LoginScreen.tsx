import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
  Surface,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { loginThunk } from "@/features/auth/authSlice";

type FormValues = { username: string; password: string };

const schema = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function LoginScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((s: RootState) => s.auth);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const passwordRef = React.useRef<any>(null);

  const SquareCheckbox = ({
    checked,
    onPress,
  }: {
    checked: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: checked ? theme.colors.primary : "#D1D5DB",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: checked ? theme.colors.primary : "transparent",
        marginRight: 8,
      }}
    >
      {checked ? (
        <MaterialCommunityIcons name="check" size={16} color="#fff" />
      ) : null}
    </TouchableOpacity>
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    dispatch(loginThunk(values));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
    >
      <ImageBackground
        source={require("../../assets/background.png")}
        style={{ flex: 1 }}
        imageStyle={{ opacity: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Gradient header */}
          <LinearGradient
            colors={["#ffffff00", "#ffffff00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 260,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 100,
              justifyContent: "flex-start",
            }}
          >
            <View style={{ alignItems: "center", marginTop: 8 }}>
              <Image
                source={require("../../assets/Logo.png")}
                style={{ width: 72, height: 72, marginBottom: 12 }}
                resizeMode="contain"
              />

              <Text
                variant="headlineSmall"
                style={{
                  color: "#173558",
                  fontWeight: "900",
                  marginTop: 10,
                  letterSpacing: 0.3,
                  fontSize: 32,
                }}
              >
                Kido CRM Center
              </Text>
            </View>
          </LinearGradient>

          {/* Content card */}
          <View style={{ padding: 20, flex: 1 }}>
            <LinearGradient
              colors={["#ffffff00", "#ffffff00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 1.5, borderRadius: 20 }}
            >
              <Controller
                name="username"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                  const isValid = !!value && !errors.username;
                  return (
                    <>
                      <TextInput
                        mode="outlined"
                        label="Tên đăng nhập"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="username"
                        autoComplete="username"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        outlineColor="#E6ECFF"
                        activeOutlineColor={theme.colors.primary}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus?.()}
                        style={{ backgroundColor: "transparent" }}
                        outlineStyle={{ borderRadius: 14 }}
                        contentStyle={{ height: 48 }}
                        left={<TextInput.Icon icon="account" />}
                        right={
                          isValid ? (
                            <TextInput.Icon
                              icon={
                                isValid
                                  ? "check-circle"
                                  : "checkbox-blank-circle-outline"
                              }
                              color={"#22C55E"}
                            />
                          ) : null
                        }
                      />
                      <HelperText type="error" visible={!!errors.username}>
                        {errors.username?.message}
                      </HelperText>
                    </>
                  );
                }}
              />
              <Controller
                name="password"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => {
                  return (
                    <>
                      <TextInput
                        mode="outlined"
                        label="Mật khẩu"
                        secureTextEntry={!passwordVisible}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        outlineColor="#E6ECFF"
                        activeOutlineColor={theme.colors.primary}
                        style={{ backgroundColor: "transparent" }}
                        outlineStyle={{ borderRadius: 14 }}
                        contentStyle={{ height: 48 }}
                        ref={passwordRef}
                        textContentType="password"
                        autoComplete="password"
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)}
                        left={<TextInput.Icon icon="lock-outline" />}
                        right={
                          <TextInput.Icon
                            icon={passwordVisible ? "eye-off" : "eye"}
                            onPress={() => setPasswordVisible((v) => !v)}
                          />
                        }
                      />
                      <HelperText type="error" visible={!!errors.password}>
                        {errors.password?.message}
                      </HelperText>
                    </>
                  );
                }}
              />

              {/* Options row */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <SquareCheckbox
                    checked={rememberMe}
                    onPress={() => setRememberMe((v) => !v)}
                  />
                  <Text>Ghi nhớ đăng nhập</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Quên mật khẩu"
                >
                  <Text
                    style={{ color: theme.colors.primary, fontWeight: "600" }}
                  >
                    Quên mật khẩu?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Error block */}
              {!!auth.errorMessage && (
                <View
                  style={{
                    borderRadius: 10,
                    padding: 12,
                    backgroundColor: "#fdecea",
                    borderColor: "#f5c2c0",
                    borderWidth: 1,
                    marginTop: 12,
                  }}
                >
                  <Text style={{ color: "#b42318" }}>{auth.errorMessage}</Text>
                </View>
              )}

              {/* Submit button - WhatsApp simple pill */}
              <TouchableOpacity
                accessibilityRole="button"
                activeOpacity={0.85}
                onPress={handleSubmit(onSubmit)}
                disabled={auth.loading}
                style={{
                  marginTop: 30,
                  borderRadius: 28,
                  marginLeft: "10%",
                  marginRight: "10%",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: 54,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: auth.loading ? "#A9E8C1" : "#1EBE71",
                  }}
                >
                  {auth.loading ? (
                    <Text style={{ color: "white", fontWeight: "700" }}>Đang xử lý...</Text>
                  ) : (
                    <Text style={{ color: "white", fontWeight: "700" }}>Đăng nhập</Text>
                  )}
                </View>
              </TouchableOpacity>
            </LinearGradient>

            {/* Footer note fixed at bottom */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: "#6B7280" }}>
                © {new Date().getFullYear()} Kido CRM Center
              </Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
