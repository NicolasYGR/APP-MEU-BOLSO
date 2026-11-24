// ============================================================================
// ARQUIVO: app/(app)/edit-transaction.js  (tela EDITAR / EXCLUIR transação)
// ----------------------------------------------------------------------------
// Parecida com "Nova transação", mas aqui os campos já vêm PREENCHIDOS com os
// dados existentes. Conceitos: parâmetros de rota, SELECT por id, UPDATE e DELETE.
// ============================================================================

import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
// useLocalSearchParams: lê os parâmetros enviados pela tela anterior (aqui, o "id").
import { router, useLocalSearchParams } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import AppInput from '../../src/components/AppInput';
import { getCurrentUser } from '../../src/services/authService';
import { getTransaction, updateTransaction, deleteTransaction } from '../../src/services/transactionService';
import { validateTransaction } from '../../src/utils/validation';

export default function EditTransaction(){
  // Pega o "id" que a home enviou em router.push({... params:{id}}).
  const {id}=useLocalSearchParams();
  const [descricao,setDescricao]=useState('');
  const [valor,setValor]=useState('');
  const [tipo,setTipo]=useState('');
  const [data,setData]=useState('');
  const [observacao,setObservacao]=useState('');
  const [loading,setLoading]=useState(true);  // carregando os dados existentes
  const [saving,setSaving]=useState(false);   // salvando as alterações

  // Ao abrir a tela (e sempre que o "id" mudar), busca a transação no banco.
  useEffect(()=>{(async()=>{
    const {user}=await getCurrentUser();
    if(!user){router.replace('/');return;}
    // Busca UMA transação pelo id, garantindo que ela pertence ao usuário logado.
    const {data,error}=await getTransaction(id,user.id);
    if(error){Alert.alert('Erro',error.message);router.back();return;}
    // Preenche o formulário com os valores atuais.
    // String(...) porque os campos de texto trabalham com texto, não com número.
    setDescricao(data.descricao); setValor(String(data.valor));
    setTipo(data.tipo); setData(data.data); setObservacao(data.observacao||'');
    setLoading(false); // dados prontos: pode mostrar o formulário
  })();},[id]);

  // ----- ATUALIZAR (UPDATE) -----
  async function update(){
    const validation=validateTransaction({descricao,valor,tipo});
    if(validation)return Alert.alert('Atenção',validation);
    const {user}=await getCurrentUser();
    if(!user){router.replace('/');return;}

    try{
      setSaving(true);
      // Envia somente os campos que podem mudar.
      const {error}=await updateTransaction(id,user.id,{
        descricao:descricao.trim(),
        valor:Number(String(valor).replace(',','.')),
        tipo,data,observacao:observacao.trim()||null
      });
      if(error){Alert.alert('Erro',error.message);return;}
      Alert.alert('Sucesso','Transação atualizada.');
      router.back();
    }finally{setSaving(false);}
  }

  // ----- EXCLUIR (DELETE) -----
  function remove(){
    // Alert com botões: pedimos CONFIRMAÇÃO antes de apagar algo de forma definitiva.
    Alert.alert('Excluir','Esta ação não poderá ser desfeita.',[
      {text:'Cancelar',style:'cancel'},
      // style 'destructive' deixa o botão vermelho no iOS.
      // onPress async: só executa se o usuário confirmar.
      {text:'Excluir',style:'destructive',onPress:async()=>{
        const {user}=await getCurrentUser();
        if(!user){router.replace('/');return;}
        const {error}=await deleteTransaction(id,user.id);
        if(error)Alert.alert('Erro',error.message);
        else router.back();
      }}
    ]);
  }

  // Enquanto os dados não chegam, não desenha nada (evita mostrar formulário vazio).
  if(loading)return null;

  return <ScrollView contentContainerStyle={styles.container}>
    <AppInput label="Descrição" value={descricao} onChangeText={setDescricao}/>
    <AppInput label="Valor" keyboardType="decimal-pad" value={valor} onChangeText={setValor}/>
    <Text style={styles.label}>Tipo</Text>
    {/* tipo==='receita'&&styles.selected -> destaca o botão do tipo atual */}
    <TouchableOpacity style={[styles.type,tipo==='receita'&&styles.selected]} onPress={()=>setTipo('receita')}><Text>Receita</Text></TouchableOpacity>
    <TouchableOpacity style={[styles.type,tipo==='despesa'&&styles.selected]} onPress={()=>setTipo('despesa')}><Text>Despesa</Text></TouchableOpacity>
    <AppInput label="Data" value={data} onChangeText={setData}/>
    <AppInput label="Observação" multiline value={observacao} onChangeText={setObservacao}/>
    <AppButton title="Salvar alterações" onPress={update} loading={saving}/>
    <TouchableOpacity style={styles.delete} onPress={remove}><Text style={styles.deleteText}>Excluir transação</Text></TouchableOpacity>
  </ScrollView>;
}
const styles=StyleSheet.create({
 container:{padding:20,backgroundColor:'#f8f9fa'},label:{fontWeight:'700',marginBottom:8},
 type:{padding:14,borderRadius:12,borderWidth:1,borderColor:'#dcdde1',backgroundColor:'#fff',marginBottom:8},
 selected:{borderColor:'#00b894',backgroundColor:'#dff9f2'},
 delete:{alignItems:'center',padding:16,marginTop:12},deleteText:{color:'#ff4757',fontWeight:'800'}
});
