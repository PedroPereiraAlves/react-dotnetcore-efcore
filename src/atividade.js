export const PRIORIDADES = {
  1: { label: 'Baixa', badge: 'success', icone: 'smile' },
  2: { label: 'Normal', badge: 'secondary', icone: 'meh' },
  3: { label: 'Alta', badge: 'danger', icone: 'frown' },
};

export const LIMITES = {
  titulo: 100,
  descricao: 500,
};

export const atividadeVazia = {
  id: 0,
  titulo: '',
  prioridade: '',
  descricao: '',
};

const prioridadeIndefinida = {
  label: 'Não definida',
  badge: 'secondary',
  icone: 'question',
};

export function obterPrioridade(valor) {
  return PRIORIDADES[valor] ?? prioridadeIndefinida;
}

export function validarAtividade(atividade) {
  const erros = {};
  const titulo = atividade.titulo.trim();
  const descricao = atividade.descricao.trim();

  if (!titulo) {
    erros.titulo = 'Informe um título.';
  } else if (titulo.length > LIMITES.titulo) {
    erros.titulo = `Use no máximo ${LIMITES.titulo} caracteres no título.`;
  }

  if (!Object.prototype.hasOwnProperty.call(PRIORIDADES, String(atividade.prioridade))) {
    erros.prioridade = 'Selecione uma prioridade.';
  }

  if (descricao.length > LIMITES.descricao) {
    erros.descricao = `Use no máximo ${LIMITES.descricao} caracteres na descrição.`;
  }

  return erros;
}

export function normalizarAtividade(atividade) {
  return {
    id: atividade.id,
    titulo: atividade.titulo.trim(),
    prioridade: String(atividade.prioridade),
    descricao: atividade.descricao.trim(),
  };
}
