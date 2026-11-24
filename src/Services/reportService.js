// ============================================================================
// ARQUIVO: src/services/reportService.js  (RELATÓRIO EM PDF)
// ----------------------------------------------------------------------------
// Ideia: montar uma página em HTML (texto) e pedir ao celular para transformá-la
// em PDF. Depois, abrir o menu "Compartilhar" para o usuário salvar/enviar.
// ============================================================================

// expo-print: converte HTML em arquivo PDF.
import * as Print from 'expo-print';
// expo-sharing: abre o menu de compartilhamento do sistema (WhatsApp, e-mail, salvar...).
import * as Sharing from 'expo-sharing';

import {
  formatCurrency,
  formatDate
} from '../utils/format';

// Recebe a lista de transações e o saldo já calculado.
export async function generatePdf(
  transactions,
  balance
) {

  // 1) Monta as LINHAS da tabela.
  //    .map() transforma cada transação em um pedaço de HTML (<tr> = linha da tabela).
  //    Os `${...}` dentro das crases inserem os valores no texto (template string).
  //    .join('') junta todas as linhas em um único texto.
  const rows =
    transactions
      .map(item => `
        <tr>

          <td>
            ${formatDate(item.data)}
          </td>

          <td>
            ${item.descricao}
          </td>

          <td>
            ${item.tipo}
          </td>

          <td>
            ${formatCurrency(item.valor)}
          </td>

        </tr>
      `)
      .join('');

  // 2) Monta a página HTML completa: título, saldo e a tabela com as linhas acima.
  //    (HTML é a linguagem de marcação das páginas web; aqui ela "desenha" o PDF.)
  const html = `
    <html>

      <body>

        <h1>
          Meu Bolso
        </h1>

        <h2>
          Relatório financeiro
        </h2>

        <p>
          <b>Saldo:</b>
          ${formatCurrency(balance)}
        </p>

        <table
          border="1"
          cellpadding="8"
          style="
            border-collapse: collapse;
            width: 100%;
          "
        >

          <tr>

            <th>Data</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Valor</th>

          </tr>

          ${rows}

        </table>

      </body>

    </html>
  `;

  // 3) Gera o arquivo PDF no aparelho e recebe o endereço (uri) dele.
  const {
    uri
  } = await Print.printToFileAsync({
    html
  });

  // 4) Se o aparelho suportar compartilhamento, abre o menu para enviar/salvar o PDF.
  if (
    await Sharing.isAvailableAsync()
  ) {

    await Sharing.shareAsync(uri);

  }

  // 5) Devolve o endereço do arquivo (pode ser útil para outras partes do app).
  return uri;
}
