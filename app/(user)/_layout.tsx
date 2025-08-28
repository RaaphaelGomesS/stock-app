import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerShadowVisible: true,
        headerTintColor: "#0f172a",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Meu Perfil" }} />
      <Stack.Screen name="edit" options={{ title: "Editar Perfil" }} />
    </Stack>
  );
}
