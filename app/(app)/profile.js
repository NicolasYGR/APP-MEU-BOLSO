// ============================================================================
// ARQUIVO: app/(app)/profile.js  (tela MEU PERFIL)
// ----------------------------------------------------------------------------
// Permite ver o e-mail, mudar o nome, trocar a senha, escolher uma foto
// (galeria do celular) e sair da conta.
// Conceitos: permissões do celular, expo-image-picker, upload de arquivo,
// metadados do usuário no Supabase Auth.
// ============================================================================

import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
// ImagePicker: biblioteca do Expo que abre a galeria de fotos do aparelho.
import * as ImagePicker from 'expo-image-picker';
// uploadAvatar: envia a foto escolhida para o Supabase Storage.
import {uploadAvatar} from '../../src/services/storageService';
import { router } from 'expo-router';
import AppButton from '../../src/components/AppButton';
import AppInput from '../../src/components/AppInput';
import { supabase } from '../../src/services/supabase';
import { signOut } from '../../src/services/authService';
// ⚠️ Observação do professor: a função chooseImage (mais abaixo) usa "getCurrentUser",
// mas ela NÃO foi importada aqui. Sem "import { getCurrentUser } from '../../src/services/authService'"
// (ou adicionando-a na linha acima junto com signOut), o app dá erro ao escolher a foto.

export default function Profile(){
  const [user,setUser]=useState(null);        // dados do usuário logado
  const [name,setName]=useState('');          // nome exibido/editado
  const [password,setPassword]=useState('');  // nova senha digitada
  const [avatar,setAvatar]=useState('');      // URL da foto de perfil
  const [loading,setLoading]=useState(false);

  // Ao abrir a tela, busca o usuário atual e preenche os campos.
  useEffect(()=>{(async()=>{
    const {data}=await supabase.auth.getUser();
    // Sem usuário -> volta ao login.
    if(!data.user){router.replace('/');return;}
    setUser(data.user);
    // user_metadata = "gaveta" onde o Supabase guarda dados extras do usuário.
    // O "?." (encadeamento opcional) evita erro se user_metadata não existir.
    setName(data.user.user_metadata?.name||'');
    setAvatar(data.user.user_metadata?.avatar_url||'');
  })();},[]);

  // Salva o nome do usuário no metadata.
  async function save(){
    setLoading(true);
    const {data,error}=await supabase.auth.updateUser({data:{name:name.trim()}});
    setLoading(false);
    if(error)Alert.alert('Erro',error.message);
    else {setUser(data.user);Alert.alert('Sucesso','Perfil atualizado.');}
  }

  // Troca a senha do usuário logado.
  async function changePassword(){
    if(password.length<6)return Alert.alert('Atenção','Use pelo menos 6 caracteres.');
    const {error}=await supabase.auth.updateUser({password});
    if(error)Alert.alert('Erro',error.message);
    else {setPassword('');Alert.alert('Sucesso','Senha alterada.');}
  }

  // ----- ESCOLHER E ENVIAR A FOTO DE PERFIL -----
  async function chooseImage() {

  // 1) Pede PERMISSÃO ao usuário para acessar a galeria.
  //    Apps móveis precisam de autorização para recursos sensíveis (fotos, câmera, GPS...).
  const permission =
    await ImagePicker
      .requestMediaLibraryPermissionsAsync();

  // 2) Se o usuário negou, avisa e encerra.
  if (!permission.granted) {
    Alert.alert(
      'Permissão necessária',
      'Autorize o acesso às fotos.'
    );

    return;
  }

  // 3) Abre a galeria. Opções:
  //    mediaTypes: só imagens | allowsEditing: permite recortar
  //    aspect [1,1]: recorte quadrado | quality 0.8: compacta a imagem (80%)
  const result =
    await ImagePicker
      .launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

  // 4) Se o usuário cancelou a escolha, não há nada a fazer.
  if (result.canceled) {
    return;
  }

  // 5) Pega o endereço (uri) do arquivo escolhido.
  const uri =
    result.assets[0].uri;

  // 6) Descobre o usuário logado (o nome da pasta no Storage usa o id dele).
  const { user } =
    await getCurrentUser();

  if (!user) {
    return;
  }

  // 7) Envia a imagem ao Supabase Storage (veja storageService.js).
  const { error } =
    await uploadAvatar(
      user.id,
      uri
    );

  if (error) {
    Alert.alert(
      'Erro',
      error.message
    );

    return;
  }

  Alert.alert(
    'Sucesso',
    'Foto atualizada!'
  );
}


  // ---- VERSÃO ANTIGA (guardava só o endereço local da foto, sem enviar ao servidor) ----
  // async function chooseImage(){
  //   const permission=await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if(!permission.granted)return Alert.alert('Permissão necessária','Autorize o acesso às fotos.');
  //   const result=await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes:['images'],allowsEditing:true,aspect:[1,1],quality:.8
  //   });
  //   if(result.canceled)return;
  //   const uri=result.assets[0].uri;
  //   setAvatar(uri);
  //   // Etapa seguinte: enviar uri para Supabase Storage.
  //   const {error}=await supabase.auth.updateUser({data:{avatar_url:uri}});
  //   if(error)Alert.alert('Erro',error.message);
  // }

  // Encerra a sessão e volta ao login.
  async function logout(){await signOut();router.replace('/');}

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Meu perfil</Text>
    {/* Renderização condicional (operador ternário  condição ? A : B):
        se existe foto, mostra a imagem; senão, mostra um círculo cinza com 👤 */}
    {avatar?<Image source={{uri:avatar}} style={styles.avatar}/>:<View style={styles.placeholder}><Text>👤</Text></View>}
    <AppButton title="Escolher foto" onPress={chooseImage}/>
    {/* editable={false}: o e-mail aparece, mas não pode ser alterado */}
    <AppInput label="E-mail" value={user?.email||''} editable={false}/>
    <AppInput label="Nome" value={name} onChangeText={setName}/>
    <AppButton title="Salvar perfil" onPress={save} loading={loading}/>
    <AppInput label="Nova senha" secureTextEntry value={password} onChangeText={setPassword}/>
    <AppButton title="Alterar senha" onPress={changePassword}/>
    <AppButton title="Sair" onPress={logout}/>
  </ScrollView>;
}
const styles=StyleSheet.create({
 container:{padding:20,backgroundColor:'#f8f9fa'},title:{fontSize:28,fontWeight:'900',marginBottom:20},
 // borderRadius = metade da largura -> deixa a imagem perfeitamente redonda
 avatar:{width:110,height:110,borderRadius:55,alignSelf:'center',marginBottom:16},
 placeholder:{width:110,height:110,borderRadius:55,backgroundColor:'#dcdde1',alignSelf:'center',justifyContent:'center',alignItems:'center',marginBottom:16}
});
