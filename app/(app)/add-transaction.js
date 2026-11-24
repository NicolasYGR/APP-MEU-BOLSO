// ============================================================================
// ARQUIVO: app/(app)/add-transaction.js  (tela NOVA TRANSAÇÃO)
// ----------------------------------------------------------------------------
// Formulário que cadastra uma receita ou despesa. Conceitos: vários estados,
// useEffect para buscar dados ao abrir, filtro de lista, map() para criar
// botões dinamicamente, validação e INSERT no banco.
// ============================================================================

import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import AppInput from '../../src/components/AppInput';
import { getCurrentUser } from '../../src/services/authService';
import { createTransaction } from '../../src/services/transactionService';
import { listCategories } from '../../src/services/categoryService';
// validateTransaction: confere se os campos estão corretos (veja utils/validation.js).
import { validateTransaction } from '../../src/utils/validation';

export default function AddTransaction(){
  // ----- ESTADOS: um para cada campo do formulário -----
  const [descricao,setDescricao]=useState('');
  const [valor,setValor]=useState('');
  const [tipo,setTipo]=useState('');                 // 'receita' ou 'despesa' (começa vazio)
  const [categoriaId,setCategoriaId]=useState(null); // id da categoria escolhida (null = nenhuma)
  // Data de hoje no formato AAAA-MM-DD:
  // new Date().toISOString() -> "2026-11-23T10:00:00.000Z"; slice(0,10) -> pega só "2026-11-23"
  const [data,setData]=useState(new Date().toISOString().slice(0,10));
  const [observacao,setObservacao]=useState('');
  const [categorias,setCategorias]=useState([]);     // todas as categorias vindas do banco
  const [loading,setLoading]=useState(false);

  // Executa UMA vez, quando a tela abre (lista de dependências vazia []).
  // O formato "(async()=>{ ... })();" é uma função assíncrona que se chama sozinha,
  // necessário porque o useEffect não aceita receber diretamente uma função async.
  useEffect(()=>{(async()=>{
    const {data,error}=await listCategories();
    if(error)Alert.alert('Erro',error.message);
    else setCategorias(data||[]);
  })();},[]);

  // Mostra apenas as categorias do tipo escolhido (receita OU despesa).
  // Se o tipo mudar, essa lista é recalculada automaticamente a cada redesenho.
  const filtered=categorias.filter(x=>x.tipo===tipo);

  // ----- SALVAR -----
  async function save(){
    // 1) Valida. A função devolve um TEXTO de erro, ou null se estiver tudo certo.
    const validation=validateTransaction({descricao,valor,tipo});
    if(validation)return Alert.alert('Atenção',validation);

    // 2) Precisamos do id do usuário para gravar a transação em nome dele.
    const {user}=await getCurrentUser();
    if(!user){router.replace('/');return;}

    try{
      setLoading(true);
      // 3) Insere a nova linha na tabela "transacoes" do Supabase.
      const {error}=await createTransaction({
        user_id:user.id,                       // dono da transação
        descricao:descricao.trim(),            // remove espaços das pontas
        // O usuário pode digitar "12,50"; o JavaScript só entende "12.50".
        // Por isso trocamos a vírgula por ponto e convertemos para Number.
        valor:Number(String(valor).replace(',','.')),
        tipo,
        categoria_id:categoriaId,              // chave estrangeira da tabela categorias
        data,
        // Se a observação estiver vazia, grava null (vazio de verdade) no banco.
        observacao:observacao.trim()||null,
      });
      if(error){Alert.alert('Erro',error.message);return;}
      Alert.alert('Sucesso','Transação cadastrada.');
      router.back(); // volta para a tela anterior (home)
    }finally{setLoading(false);}
  }

  // ScrollView: permite rolar a tela quando o conteúdo não cabe (ex.: com teclado aberto).
  return <ScrollView contentContainerStyle={styles.container}>
    <AppInput label="Descrição" value={descricao} onChangeText={setDescricao}/>
    {/* decimal-pad: teclado numérico com vírgula/ponto */}
    <AppInput label="Valor" keyboardType="decimal-pad" value={valor} onChangeText={setValor}/>

    <Text style={styles.label}>Tipo</Text>
    <View style={styles.row}>
      {/* .map() percorre a lista ['receita','despesa'] e cria UM botão para cada item.
          "key" é obrigatória: ajuda o React a identificar cada botão da lista. */}
      {['receita','despesa'].map(x=><TouchableOpacity key={x}
        // style em lista = junta estilos. "x===tipo&&styles.selected" aplica o estilo
        // "selected" SOMENTE se este botão for o tipo escolhido.
        style={[styles.type,x===tipo&&styles.selected]}
        // Ao escolher o tipo, também zera a categoria (porque as categorias dependem do tipo).
        onPress={()=>{setTipo(x);setCategoriaId(null);}}>
        <Text>{x==='receita'?'Receita':'Despesa'}</Text>
      </TouchableOpacity>)}
    </View>

    <Text style={styles.label}>Categoria</Text>
    <View style={styles.categories}>
      {/* Um botão para cada categoria do tipo escolhido */}
      {filtered.map(x=><TouchableOpacity key={x.id}
        style={[styles.category,x.id===categoriaId&&styles.selected]}
        onPress={()=>setCategoriaId(x.id)}>
        <Text>{x.nome}</Text>
      </TouchableOpacity>)}
    </View>

    <AppInput label="Data" value={data} onChangeText={setData}/>
    {/* multiline: permite várias linhas no campo de texto */}
    <AppInput label="Observação" multiline value={observacao} onChangeText={setObservacao}/>
    <AppButton title="Salvar transação" onPress={save} loading={loading}/>
  </ScrollView>;
}
const styles=StyleSheet.create({
 container:{padding:20,backgroundColor:'#f8f9fa'},
 label:{fontWeight:'700',marginBottom:8},
 // gap: espaço entre os itens | flexWrap:'wrap': quebra para a linha de baixo quando não cabe
 row:{flexDirection:'row',gap:8,marginBottom:20},
 type:{flex:1,padding:14,borderRadius:12,borderWidth:1,borderColor:'#dcdde1',alignItems:'center',backgroundColor:'#fff'},
 selected:{borderColor:'#00b894',backgroundColor:'#dff9f2'},
 categories:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:20},
 category:{padding:10,borderRadius:10,borderWidth:1,borderColor:'#dcdde1',backgroundColor:'#fff'}
});
