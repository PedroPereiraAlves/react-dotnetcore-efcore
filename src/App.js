import { useState } from 'react';
import './App.css';
import AtividadeForm from './components/AtividadeForm';
import AtividadeLista from './components/AtividadeLista';
import { atividadeVazia } from './atividade';

const atividadesIniciais = [
  {
    id: 1,
    prioridade: '1',
    titulo: 'Revisar documentação',
    descricao: 'Atualizar o passo a passo de execução do projeto.',
  },
  {
    id: 2,
    prioridade: '2',
    titulo: 'Organizar o backlog',
    descricao: 'Ordenar as atividades da semana por prioridade.',
  },
  {
    id: 3,
    prioridade: '3',
    titulo: 'Corrigir o formulário',
    descricao: 'Impedir o cadastro de atividades sem título.',
  },
];

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

function App() {
  const [atividades, setAtividades] = useState(atividadesIniciais);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(atividadeVazia);
  const [mensagem, setMensagem] = useState('');

  function adicionarAtividade(atividade) {
    setAtividades((lista) => [
      ...lista,
      { ...atividade, id: proximoId(lista) },
    ]);
    setMensagem(`Atividade "${atividade.titulo}" adicionada.`);
  }

  function atualizarAtividade(atividade) {
    setAtividades((lista) => lista.map((item) => (
      item.id === atividade.id ? atividade : item
    )));
    setAtividadeSelecionada(atividadeVazia);
    setMensagem(`Atividade "${atividade.titulo}" atualizada.`);
  }

  function cancelarAtividade() {
    setAtividadeSelecionada(atividadeVazia);
    setMensagem('Edição cancelada.');
  }

  function excluirAtividade(id) {
    const removida = atividades.find((item) => item.id === id);
    setAtividades((lista) => lista.filter((item) => item.id !== id));
    if (atividadeSelecionada.id === id) {
      setAtividadeSelecionada(atividadeVazia);
    }
    setMensagem(removida
      ? `Atividade "${removida.titulo}" excluída.`
      : 'Atividade excluída.');
  }

  function selecionarAtividade(id) {
    const encontrada = atividades.find((item) => item.id === id);
    if (encontrada) {
      setAtividadeSelecionada({ ...encontrada });
      setMensagem(`Editando "${encontrada.titulo}".`);
    }
  }

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="h3 mb-1">Atividades</h1>
        <p className="text-muted mb-0">
          Cadastre, edite e organize atividades por prioridade.
        </p>
      </header>
      <main>
        {mensagem && (
          <div className="alert alert-success" role="status">
            {mensagem}
          </div>
        )}
        <AtividadeForm
          atividadeSelecionada={atividadeSelecionada}
          onAdicionar={adicionarAtividade}
          onAtualizar={atualizarAtividade}
          onCancelar={cancelarAtividade}
        />
        <AtividadeLista
          atividades={atividades}
          selecionadaId={atividadeSelecionada.id}
          onEditar={selecionarAtividade}
          onExcluir={excluirAtividade}
        />
      </main>
    </div>
  );
}

export default App;
