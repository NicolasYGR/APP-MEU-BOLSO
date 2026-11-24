// ============================================================================
// ARQUIVO: src/services/profileService.js  (cópia ANTIGA do upload de avatar)
// ----------------------------------------------------------------------------
// ⚠️ Observação do professor: esta função é IGUAL à uploadAvatar de
// storageService.js (que é a usada pela tela de perfil). Código duplicado
// deve ser evitado. Além disso, aqui FALTA a linha:
//     import { supabase } from './supabase';
// Sem ela, se alguém chamar esta função, ocorrerá o erro "supabase is not defined".
// Sugestão: apagar este arquivo e manter apenas o storageService.js.
// ============================================================================

export async function uploadAvatar(userId, uri) {
  // Lê o arquivo da foto e converte em bytes
  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();
  // Caminho no bucket: uma pasta por usuário
  const path = `${userId}/avatar.jpg`;

  // Envia para o bucket "avatars" (upsert:true substitui a foto antiga)
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) return { error: uploadError };

  // Obtém a URL pública e grava no cadastro do usuário
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);

  const result = await supabase.auth.updateUser({
    data: { avatar_url: data.publicUrl },
  });

  return result;
}
