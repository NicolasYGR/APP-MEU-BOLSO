// ============================================================================
// ARQUIVO: app/(app)/home.js  (tela PRINCIPAL: saldo, resumo e lista)
// ----------------------------------------------------------------------------
// Conceitos: useState, useCallback, useFocusEffect, filter + reduce,
// componentização (cada "pedaço" da tela é um componente) e FlatList.
// ============================================================================

// useCallback: "congela" uma função para ela não ser recriada a cada redesenho.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// useFocusEffect: roda um código TODA VEZ que a tela ganha o foco
// (inclusive quando voltamos de outra tela, como "Nova transação").
import { router, useFocusEffect } from 'expo-router';
// Componentes visuais que montam a tela:
import BalanceCard from '../../src/components/BalanceCard';       // cartão do saldo
import SummaryCard from '../../src/components/SummaryCard';       // cartões de receitas/despesas
import TransactionList from '../../src/components/TransactionList'; // lista de transações
import FloatingButton from '../../src/components/FloatingButton'; // botão redondo "+"
import AppButton from '../../src/components/AppButton';
// Serviços = funções que falam com o Supabase ou com recursos do celular.
import { getCurrentUser, signOut } from '../../src/services/authService';
import { listTransactions } from '../../src/services/transactionService';
import {
  generatePdf
} from '../../src/services/reportService';


export default function Home(){
  // ----- ESTADOS (a memória da tela) -----
  const [transacoes,setTransacoes]=useState([]);   // lista vinda do banco
  const [receitas,setReceitas]=useState(0);        // soma de tudo que entrou
  const [despesas,setDespesas]=useState(0);        // soma de tudo que saiu
  const [loading,setLoading]=useState(true);       // carregamento INICIAL da tela
  const [refreshing,setRefreshing]=useState(false);// "puxar para atualizar" (pull to refresh)

  // ----- BUSCAR DADOS NO BANCO -----
  // useCallback com [] = a função é criada uma única vez.
  const carregar=useCallback(async()=>{
    try{
      // 1) Descobre quem é o usuário logado.
      const {user}=await getCurrentUser();
      // Sem usuário? Volta ao login e encerra.
      if(!user){router.replace('/');return;}

      // 2) Busca no Supabase as transações DESTE usuário.
      const {data,error}=await listTransactions(user.id);
      if(error){Alert.alert('Erro',error.message);return;}

      // 3) "data||[]" = se vier vazio/nulo, usa uma lista vazia (evita erro).
      const lista=data||[];
      setTransacoes(lista);

      // 4) Cálculo dos totais:
      //    .filter -> separa só as transações do tipo desejado
      //    .reduce -> soma os valores (s = soma acumulada, x = item atual; começa em 0)
      //    Number(x.valor) -> garante que o valor é número (pode vir como texto)
      setReceitas(lista.filter(x=>x.tipo==='receita')
        .reduce((s,x)=>s+Number(x.valor),0));
      setDespesas(lista.filter(x=>x.tipo==='despesa')
        .reduce((s,x)=>s+Number(x.valor),0));
    }finally{setLoading(false);} // terminou (deu certo ou não): tira o "carregando"
  },[]);

  // Toda vez que a tela ganhar foco, recarrega os dados.
  // Assim, ao salvar uma transação nova e voltar, a lista já aparece atualizada.
  useFocusEffect(useCallback(()=>{carregar();},[carregar]));

  // Chamada pelo gesto de "puxar a lista para baixo".
  async function refresh(){setRefreshing(true);await carregar();setRefreshing(false);}

  // Gera o relatório em PDF (a lógica fica em reportService.js).
  async function handleGeneratePdf() {

  try {

    // Passa a lista e o saldo (receitas - despesas) para o gerador de PDF.
    await generatePdf(
      transacoes,
      receitas - despesas
    );

  } catch (error) {

    // Se algo falhar (ex: sem permissão), avisa o usuário de forma amigável.
    Alert.alert(
      'Erro',
      'Não foi possível gerar o relatório.'
    );

  }
}


  // Ao tocar em uma transação, abre a tela de edição enviando o "id" como PARÂMETRO.
  // String(item.id): parâmetros de rota trafegam como texto.
  function edit(item){
    router.push({pathname:'/(app)/edit-transaction',params:{id:String(item.id)}});
  }

  // Enquanto carrega pela 1ª vez, mostra só uma rodinha girando no centro.
  if(loading)return <View style={styles.center}><ActivityIndicator size="large"/></View>;

  // ----- O QUE APARECE NA TELA -----
  return <View style={styles.container}>
    {/* Cabeçalho: título à esquerda e link "Perfil" à direita */}
    <View style={styles.header}>
      <View><Text style={styles.title}>Meu Bolso</Text><Text style={styles.sub}>Resumo financeiro</Text></View>
      <TouchableOpacity onPress={()=>router.push('/(app)/profile')}><Text style={styles.profile}>Perfil</Text></TouchableOpacity>
    </View>

    {/* Saldo = receitas menos despesas */}
    <BalanceCard balance={receitas-despesas}/>

    <AppButton
  title="Gerar relatório PDF"
  onPress={handleGeneratePdf}
/>


    {/* Dois cartões lado a lado (row = linha). O "type" define a cor (verde/vermelho). */}
    <View style={styles.row}>
      <SummaryCard title="Receitas" value={receitas} type="receita"/>
      <SummaryCard title="Despesas" value={despesas} type="despesa"/>
    </View>

    <Text style={styles.section}>Últimas transações</Text>

    {/* Lista rolável. onPress=edit -> ao tocar num item, chama a função edit(item). */}
    <TransactionList data={transacoes} onPress={edit} refreshing={refreshing} onRefresh={refresh}/>

    {/* Botão flutuante "+" que leva à tela de nova transação */}
    <FloatingButton onPress={()=>router.push('/(app)/add-transaction')}/>
  </View>;
}
const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#f8f9fa',padding:24,paddingTop:60},
 // flexDirection:'row' coloca os filhos lado a lado; space-between empurra um para cada ponta
 header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:16},
 title:{fontSize:26,fontWeight:'900',color:'#2f3640'},
 sub:{color:'#7f8c8d'},
 profile:{color:'#008f72',fontWeight:'700'},
 row:{flexDirection:'row',marginHorizontal:-4},
 section:{fontSize:18,fontWeight:'800',marginVertical:10},center:{flex:1,justifyContent:'center',alignItems:'center'}
});
