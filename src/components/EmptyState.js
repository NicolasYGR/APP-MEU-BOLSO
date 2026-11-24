// ============================================================================
// COMPONENTE: EmptyState  ("estado vazio")
// ----------------------------------------------------------------------------
// Mensagem exibida quando a lista de transações está VAZIA. Boa prática de UX:
// nunca deixar o usuário olhando para uma tela em branco sem explicação.
// ============================================================================

import { Text, View, StyleSheet } from 'react-native';
export default function EmptyState(){
  return <View style={styles.box}>
    <Text style={styles.title}>Nenhuma transação</Text>
    <Text style={styles.text}>Cadastre sua primeira receita ou despesa.</Text>
  </View>;
}
// flex:1 + justifyContent/alignItems 'center' -> centraliza o conteúdo na tela
const styles=StyleSheet.create({box:{flex:1,justifyContent:'center',alignItems:'center',padding:30},title:{fontSize:18,fontWeight:'800'},text:{color:'#7f8c8d',textAlign:'center',marginTop:6}});
