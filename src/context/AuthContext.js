// ============================================================================
// ARQUIVO: src/context/AuthContext.js  (CONTEXTO DE AUTENTICAÇÃO)
// ----------------------------------------------------------------------------
// PROBLEMA: várias telas precisam saber "quem está logado?".
// Passar essa informação de tela em tela (props) seria trabalhoso.
// SOLUÇÃO: a Context API do React cria um "quadro de avisos" global: o
// AuthProvider publica a informação e qualquer componente pode LER com useAuth().
// ============================================================================

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// Cria o "quadro de avisos" (contexto), inicialmente vazio (null).
const AuthContext=createContext(null);

// O Provider "envolve" o app (veja app/_layout.tsx) e fornece os dados.
// "children" = todo o aplicativo que está dentro dele.
export function AuthProvider({children}){
  const [session,setSession]=useState(null);   // dados do login (null = deslogado)
  const [loading,setLoading]=useState(true);   // true enquanto verifica se já há login salvo

  useEffect(()=>{
    // "mounted" evita atualizar o estado se o componente já foi desmontado
    // (isso causaria um aviso/erro de "memory leak").
    let mounted=true;

    // Ao abrir o app, pergunta ao Supabase: "existe uma sessão salva neste aparelho?"
    async function load(){
      const {data}=await supabase.auth.getSession();
      if(mounted){setSession(data.session);setLoading(false);}
    }

    load();

    // "Escuta" mudanças de login em tempo real: entrou, saiu, token renovado...
    // Sempre que algo mudar, atualiza a sessão e todas as telas reagem sozinhas.
    const {data:{subscription}}=supabase.auth.onAuthStateChange(
      (_event,newSession)=>setSession(newSession)
    );

    // FUNÇÃO DE LIMPEZA: roda quando o componente sai da tela.
    // Cancela a "escuta" para não ficar consumindo memória à toa.
    return ()=>{mounted=false;subscription.unsubscribe();};
  },[]); // [] = executa apenas uma vez, na abertura

  // Publica { session, loading } para todos os componentes filhos.
  return <AuthContext.Provider value={{session,loading}}>
    {children}
  </AuthContext.Provider>;
}

// Hook personalizado: um "atalho" para ler o contexto.
// Em qualquer tela basta escrever:  const {session,loading}=useAuth();
export const useAuth=()=>useContext(AuthContext);
