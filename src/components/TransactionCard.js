// ============================================================================
// COMPONENTE: TransactionCard  (UMA linha da lista de transações)
// ============================================================================

import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { formatCurrency, formatDate } from '../utils/format';

// Props: "item" = o objeto da transação (descricao, valor, tipo, data...)
//        "onPress" = o que fazer ao tocar no cartão.
export default function TransactionCard({ item, onPress }) {
  // true se for receita (usado para escolher cor e sinal).
  const income=item.tipo==='receita';
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.info}>
      <Text style={styles.desc}>{item.descricao}</Text>
      <Text style={styles.meta}>
        {/* item.categorias?.nome: o Supabase devolve a categoria "aninhada" dentro do item
            (por causa do select('*, categorias(nome)')). O "?." evita erro se for null.
            "|| 'Sem categoria'" = texto alternativo caso não exista categoria. */}
        {item.categorias?.nome || 'Sem categoria'} • {formatDate(item.data)}
      </Text>
    </View>
    {/* Receita: verde com "+"; Despesa: vermelho com "-" */}
    <Text style={[styles.value,{color:income?'#2ed573':'#ff4757'}]}>
      {income?'+':'-'} {formatCurrency(item.valor)}
    </Text>
  </TouchableOpacity>;
}
const styles=StyleSheet.create({
  // Cartão em linha: informações à esquerda e valor à direita.
  card:{backgroundColor:'#fff',borderRadius:12,padding:16,marginBottom:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  // flex:1 deixa a parte da descrição ocupar o espaço que sobra
  info:{flex:1,marginRight:10},desc:{fontSize:16,fontWeight:'700'},meta:{color:'#7f8c8d',fontSize:12,marginTop:4},value:{fontWeight:'800'}
});
