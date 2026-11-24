// ============================================================================
// ARQUIVO: src/services/transactionService.js  (CRUD de TRANSAÇÕES)
// ----------------------------------------------------------------------------
// CRUD = Create (criar), Read (ler), Update (atualizar), Delete (apagar).
// Cada função abaixo equivale a um comando SQL (mostrado em cada comentário).
// Em todas filtramos por user_id: cada usuário só enxerga/altera as SUAS transações.
// ============================================================================

import { supabase } from './supabase';

// READ (vários): lista as transações do usuário, da mais nova para a mais antiga.
// SQL:  SELECT *, categorias.nome FROM transacoes WHERE user_id = ? ORDER BY data DESC;
// 'categorias(nome)' faz um JOIN: traz também o nome da categoria relacionada.
// .eq('user_id',userId) -> "igual a" (equal) | ascending:false -> ordem decrescente
export function listTransactions(userId){
  return supabase.from('transacoes').select('*, categorias(nome)')
    .eq('user_id',userId).order('data',{ascending:false});
}

// READ (um só): busca UMA transação pelo id.
// SQL:  SELECT ... WHERE id = ? AND user_id = ?
// .single() -> espera exatamente um resultado e devolve um objeto (não uma lista).
export function getTransaction(id,userId){
  return supabase.from('transacoes').select('*, categorias(nome)')
    .eq('id',id).eq('user_id',userId).single();
}

// CREATE: insere uma nova transação.
// SQL:  INSERT INTO transacoes (...) VALUES (...);
// .select().single() -> pede ao banco que devolva a linha recém-criada.
export function createTransaction(values){
  return supabase.from('transacoes').insert(values).select().single();
}

// UPDATE: altera uma transação existente.
// SQL:  UPDATE transacoes SET ... WHERE id = ? AND user_id = ?
export function updateTransaction(id,userId,values){
  return supabase.from('transacoes').update(values)
    .eq('id',id).eq('user_id',userId).select().single();
}

// DELETE: apaga uma transação.
// SQL:  DELETE FROM transacoes WHERE id = ? AND user_id = ?
// ATENÇÃO: sem o .eq() o comando apagaria TUDO. Sempre use filtro no delete!
export function deleteTransaction(id,userId){
  return supabase.from('transacoes').delete()
    .eq('id',id).eq('user_id',userId);
}
