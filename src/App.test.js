import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

function atividade(titulo) {
  return screen.getByRole('heading', { level: 3, name: new RegExp(titulo, 'i') }).closest('li');
}

test('mostra o cadastro e as atividades iniciais', () => {
  render(<App />);

  expect(screen.getByRole('heading', { level: 1, name: 'Atividades' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 3, name: /revisar documentação/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 3, name: /organizar o backlog/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 3, name: /corrigir o formulário/i })).toBeInTheDocument();
});

test('impede salvar sem título e prioridade', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /adicionar atividade/i }));

  expect(screen.getByRole('alert')).toHaveTextContent(/revise os campos destacados/i);
  expect(screen.getByLabelText(/título/i)).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Informe um título.')).toBeInTheDocument();
  expect(screen.getByText('Selecione uma prioridade.')).toBeInTheDocument();
  expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
});

test('adiciona, edita, cancela a exclusão e depois exclui', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByLabelText(/título/i), '  Preparar demo  ');
  await user.selectOptions(screen.getByLabelText(/prioridade/i), '2');
  await user.type(screen.getByLabelText(/descrição/i), '  Mostrar o fluxo  ');
  await user.click(screen.getByRole('button', { name: /adicionar atividade/i }));

  const criada = atividade('Preparar demo');
  expect(within(criada).getByText('Mostrar o fluxo')).toBeInTheDocument();
  expect(within(criada).getByText('Normal')).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent(/preparar demo.*adicionada/i);

  await user.click(within(criada).getByRole('button', { name: /editar preparar demo/i }));
  const titulo = screen.getByLabelText(/título/i);
  expect(titulo).toHaveValue('Preparar demo');
  await user.clear(titulo);
  await user.type(titulo, 'Demo revisada');
  await user.click(screen.getByRole('button', { name: /salvar alterações/i }));

  const editada = atividade('Demo revisada');
  expect(screen.getByRole('status')).toHaveTextContent(/demo revisada.*atualizada/i);

  await user.click(within(editada).getByRole('button', { name: /excluir demo revisada/i }));
  expect(within(editada).getByText(/excluir esta atividade/i)).toBeInTheDocument();
  await user.click(within(editada).getByRole('button', { name: /manter/i }));
  expect(screen.getByRole('heading', { level: 3, name: /demo revisada/i })).toBeInTheDocument();

  const mantida = atividade('Demo revisada');
  await user.click(within(mantida).getByRole('button', { name: /excluir demo revisada/i }));
  await user.click(within(mantida).getByRole('button', { name: /confirmar exclusão/i }));
  expect(screen.queryByRole('heading', { level: 3, name: /demo revisada/i })).not.toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent(/demo revisada.*excluída/i);
});
