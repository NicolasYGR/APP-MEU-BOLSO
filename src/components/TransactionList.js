// ============================================================================
// COMPONENTE: TransactionList  (lista rolável de transações)
// ----------------------------------------------------------------------------
// Usa a FlatList, a lista otimizada do React Native: ela só desenha na tela
// os itens que estão VISÍVEIS (economiza memória em listas grandes).
// ============================================================================

import { FlatList } from 'react-native';
import TransactionCard from './TransactionCard';
import EmptyState from './EmptyState';

export default function TransactionList({data,onPress,refreshing,onRefresh}) {
  return <FlatList
    data={data}                                    // a lista de transações
    keyExtractor={item=>String(item.id)}           // identificador único de cada item
    // renderItem: "como desenhar CADA item". Para cada transação cria um TransactionCard.
    renderItem={({item})=><TransactionCard item={item} onPress={()=>onPress(item)}/>}
    refreshing={refreshing}                        // mostra a rodinha do "puxar para atualizar"
    onRefresh={onRefresh}                          // função chamada ao puxar a lista para baixo
    ListEmptyComponent={<EmptyState/>}             // exibido quando a lista está vazia
    // paddingBottom:120 deixa espaço no fim para o botão "+" não cobrir o último item.
    // flexGrow:1 (só quando vazia) permite centralizar o EmptyState na tela.
    contentContainerStyle={{paddingBottom:120,flexGrow:data.length===0?1:0}}
  />;
}
