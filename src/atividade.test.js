import { atividadeVazia, normalizarAtividade, validarAtividade } from './atividade';

test('exige título e prioridade', () => {
  expect(validarAtividade(atividadeVazia)).toEqual({
    titulo: 'Informe um título.',
    prioridade: 'Selecione uma prioridade.',
  });
});

test('rejeita título só com espaços e prioridade desconhecida', () => {
  expect(validarAtividade({
    ...atividadeVazia,
    titulo: '   ',
    prioridade: '9',
  })).toEqual({
    titulo: 'Informe um título.',
    prioridade: 'Selecione uma prioridade.',
  });
});

test('aceita atividade completa e remove espaços nas bordas', () => {
  const atividade = {
    id: 4,
    titulo: '  Preparar demo  ',
    prioridade: '2',
    descricao: '  Mostrar o fluxo  ',
  };

  expect(validarAtividade(atividade)).toEqual({});
  expect(normalizarAtividade(atividade)).toEqual({
    id: 4,
    titulo: 'Preparar demo',
    prioridade: '2',
    descricao: 'Mostrar o fluxo',
  });
});
