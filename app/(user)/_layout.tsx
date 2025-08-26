import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="edit" options={{ title: 'Editar Perfil' }} />
    </Stack>
  );
}
