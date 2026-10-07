import { render, screen } from '@testing-library/react';
import AtividadeLista from './AtividadeLista';

test('explica quando a lista está vazia', () => {
  render(
    <AtividadeLista
      atividades={[]}
      selecionadaId={0}
      onEditar={() => {}}
      onExcluir={() => {}}
    />
  );

  expect(screen.getByRole('status')).toHaveTextContent(/nenhuma atividade cadastrada/i);
});
