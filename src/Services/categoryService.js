// ============================================================================
// ARQUIVO: src/services/categoryService.js  (SERVIÇO DE CATEGORIAS)
// ============================================================================

import { supabase } from './supabase';

// Lista todas as categorias (ex.: Alimentação, Salário, Transporte...).
// Equivale ao SQL:  SELECT * FROM categorias ORDER BY nome;
//   .from('categorias') -> escolhe a tabela
//   .select('*')        -> pega todas as colunas
//   .order('nome')      -> ordena por nome (A-Z)
export function listCategories(){
  return supabase.from('categorias').select('*').order('nome');
}
