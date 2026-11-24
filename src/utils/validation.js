// ============================================================================
// ARQUIVO: src/utils/validation.js  (VALIDAÇÃO DO FORMULÁRIO DE TRANSAÇÃO)
// ----------------------------------------------------------------------------
// Validar = conferir se os dados digitados fazem sentido ANTES de enviar ao banco.
// Retorno da função:  texto com a mensagem de erro  OU  null (tudo certo).
// ============================================================================

// Recebe um objeto e já "desmonta" (desestrutura) as 3 propriedades que interessam.
export function validateTransaction({ descricao, valor, tipo }) {
  // 1) Descrição vazia? "?." evita erro se vier undefined; ".trim()" ignora espaços.
  if (!descricao?.trim()) return 'Informe a descrição.';

  // 2) Converte o valor digitado (ex.: "12,50") em número (12.5).
  const number = Number(String(valor).replace(',', '.'));
  //    Number.isFinite: false para NaN (não é número) e Infinity.
  //    Também recusamos zero e valores negativos (number <= 0).
  if (!Number.isFinite(number) || number <= 0) return 'Informe um valor válido.';

  // 3) O tipo precisa ser exatamente 'receita' ou 'despesa'.
  //    .includes(tipo) confere se o valor está dentro da lista.
  if (!['receita', 'despesa'].includes(tipo)) return 'Selecione o tipo.';

  // 4) Passou em todos os testes: sem erros.
  return null;
}
