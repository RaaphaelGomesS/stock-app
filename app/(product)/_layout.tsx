import { Stack } from "expo-router";

export default function ProductFlowLayout() {
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
      <Stack.Screen name="searchTemplate" options={{ title: "Buscar Template" }} />
      <Stack.Screen name="form" options={{ title: "Novo Produto" }} />
      <Stack.Screen
        name="selectLocation"
        options={{
          title: "Selecionar Posição",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
