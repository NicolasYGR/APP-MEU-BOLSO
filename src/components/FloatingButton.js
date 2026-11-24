// ============================================================================
// COMPONENTE: FloatingButton  (botão redondo "+" que flutua sobre a tela)
// ----------------------------------------------------------------------------
// Padrão do Material Design chamado FAB (Floating Action Button).
// Usado para a AÇÃO PRINCIPAL da tela: aqui, adicionar uma transação.
// ============================================================================

import { Text, TouchableOpacity, StyleSheet } from 'react-native';
// "onPress" chega de fora: quem usa o botão decide o que acontece ao tocar.
export default function FloatingButton({onPress}){
  return <TouchableOpacity style={styles.button} onPress={onPress}><Text style={styles.text}>+</Text></TouchableOpacity>;
}
const styles=StyleSheet.create({
  // position:'absolute' tira o botão do fluxo normal e o posiciona
  // em relação à tela: 24px da direita e 24px de baixo.
  // borderRadius = metade do tamanho (30 de 60) -> círculo perfeito.
  // elevation: sombra no Android.
  button:{position:'absolute',right:24,bottom:24,width:60,height:60,
    borderRadius:30,backgroundColor:'#00b894',
    justifyContent:'center',alignItems:'center',elevation:8},
    text:{color:'#fff',fontSize:32}});
