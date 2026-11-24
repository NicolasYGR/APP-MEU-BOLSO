// ============================================================================
// COMPONENTE: SummaryCard  (cartão pequeno: total de Receitas OU de Despesas)
// ============================================================================

import { Text, StyleSheet } from 'react-native';
import AppCard from './AppCard';
import { formatCurrency } from '../utils/format';

// Props: title (texto do topo), value (número a exibir) e type ('receita' ou 'despesa').
export default function SummaryCard({ title, value, type }) {
  // Operador ternário: se for receita -> verde; senão -> vermelho.
  const color=type==='receita'?'#2ed573':'#ff4757';
  return <AppCard style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {/* Estilo em lista: o estilo fixo + um objeto criado na hora com a cor calculada */}
    <Text style={[styles.value,{color}]}>{formatCurrency(value)}</Text>
  </AppCard>;
}
// flex:1 faz os dois cartões dividirem a largura igualmente quando ficam lado a lado.
const styles=StyleSheet.create({
  card:{flex:1,marginHorizontal:4},
  title:{color:'#7f8c8d',fontSize:12},
  value:{fontWeight:'800',fontSize:17,marginTop:6}
});
