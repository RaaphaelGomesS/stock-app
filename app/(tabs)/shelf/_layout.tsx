import { Stack } from "expo-router";

export default function ShelfLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          title: "Prateleiras",
        }}
      />
    </Stack>
  );
}
