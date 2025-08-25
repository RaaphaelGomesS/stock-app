import { View, Text, Button } from 'react-native';
import { useAuth } from "../../context/AuthContext";

export default function SelectStockScreen() {

  const {signOut} = useAuth();

  return (
    <View>
      <Text>Página de Seleção de Estoque</Text>
      <Button title='logout' onPress={signOut}></Button>
    </View>
  );
}