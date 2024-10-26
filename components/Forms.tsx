"use client";

import React, { useState } from "react";
import { View, Text, Switch } from "react-native";
import { CreatePostForm } from "@/components/CreatePostForm";
import { LoginForm } from "@/components/LoginForm";
import { SignupForm } from "@/components/SignupForm";

export const Form = () => {
  const [token, setToken] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  // TODO: use routes to show these components
  return token ? (
    <CreatePostForm token={token} />
  ) : (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
        {showLogin ? "Login" : "Sign up"}
      </Text>
      <Switch
        value={showLogin}
        onValueChange={() => setShowLogin((prev) => !prev)}
      />
      {showLogin ? <LoginForm setToken={setToken} /> : <SignupForm />}
    </View>
  );
};
