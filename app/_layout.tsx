// ============================================================================
// ARQUIVO: app/_layout.tsx  (layout RAIZ do aplicativo)
// ----------------------------------------------------------------------------
// O Expo Router usa a estrutura de PASTAS como mapa de navegação.
// O arquivo "_layout" é o "molde" que envolve todas as telas da pasta.
// Como este está na raiz da pasta "app", ele envolve o aplicativo INTEIRO.
// ============================================================================

// "Stack" = navegação em pilha: cada tela nova é colocada em cima da anterior
// (igual a uma pilha de pratos). O botão "voltar" tira a tela de cima.
import { Stack } from 'expo-router';

// AuthProvider é o nosso "provedor de login" (veja src/context/AuthContext.js).
// Ele guarda quem está logado e compartilha essa informação com todas as telas.
import { AuthProvider } from '../src/context/AuthContext';

// "export default" = esta é a função principal do arquivo.
// O Expo Router a executa automaticamente ao abrir o app.
export default function RootLayout(){
  // O AuthProvider fica POR FORA de tudo: assim, qualquer tela lá dentro
  // consegue perguntar "tem alguém logado?" usando o hook useAuth().
  return <AuthProvider>
    <Stack>
      {/* name="index" -> arquivo app/index.js (tela de Login).
          headerShown:false -> esconde a barra de título no topo. */}
      <Stack.Screen name="index" options={{headerShown:false}}/>

      {/* name="register" -> arquivo app/register.js (tela de cadastro).
          title -> texto que aparece na barra de título. */}
      <Stack.Screen name="register" options={{title:'Criar conta'}}/>

      {/* name="(app)" -> a PASTA app/(app), onde ficam as telas protegidas
          (só quem fez login acessa). Os parênteses no nome da pasta fazem
          com que "(app)" NÃO apareça na URL/rota. */}
      <Stack.Screen name="(app)" options={{headerShown:false}}/>
    </Stack>
  </AuthProvider>;
}
