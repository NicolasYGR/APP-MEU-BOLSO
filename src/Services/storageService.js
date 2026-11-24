// ============================================================================
// ARQUIVO: src/services/storageService.js  (ARMAZENAMENTO DE ARQUIVOS)
// ----------------------------------------------------------------------------
// O Supabase Storage guarda arquivos (fotos, PDFs...) em "buckets" (pastas na
// nuvem). Aqui enviamos a FOTO DE PERFIL do usuário para o bucket "avatars".
// ============================================================================

import { supabase } from './supabase';

// Recebe o id do usuário e o endereço (uri) da foto no celular.
export async function uploadAvatar(
  userId,
  uri
) {
  // 1) fetch(uri) "lê" o arquivo local como se fosse uma requisição.
  const response = await fetch(uri);

  // 2) Converte o conteúdo em arrayBuffer (bytes brutos), formato aceito para upload.
  const arrayBuffer =
    await response.arrayBuffer();

  // 3) Caminho dentro do bucket: uma pasta por usuário.
  //    Ex.: "a1b2c3/avatar.jpg". Crases `` permitem inserir variáveis com ${ }.
  const path =
    `${userId}/avatar.jpg`;

  // 4) Envia o arquivo.
  //    upsert:true -> se já existir foto, SUBSTITUI (em vez de dar erro).
  const {
    error: uploadError
  } = await supabase.storage
    .from('avatars')
    .upload(
      path,
      arrayBuffer,
      {
        contentType: 'image/jpeg',
        upsert: true,
      }
    );

  // 5) Se o envio falhou, devolve o erro para a tela tratar.
  if (uploadError) {
    return {
      error: uploadError
    };
  }

  // 6) Pega o endereço público (URL) da imagem enviada.
  const { data } =
    supabase.storage
      .from('avatars')
      .getPublicUrl(path);

  // 7) Salva essa URL no cadastro do usuário (metadata), para exibir depois.
  const result =
    await supabase.auth.updateUser({
      data: {
        avatar_url:
          data.publicUrl,
      },
    });

  return result;
}
