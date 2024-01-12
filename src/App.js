import { Fragment, useEffect, useState } from 'react';
import './App.css';
import AtividadeForm from './components/AtividadeForm'
import AtividadeLista from './components/AtividadeLista'
import atividade from './components/Atividade';

let initialState = [
  {
    "id": 1,
    "prioridade":"2",
    "titulo":"titulo",
    "descricao": "Priemira atividade"
  },
  {
    "id": 2,
    "prioridade":"3",
    "titulo":"titulo",
    "descricao": "Priemira Segunda"
  },
  {
    "id": 3,
    "prioridade":"3",
    "titulo":"titulo",
    "descricao": "Priemira Segunda"
  },
];

function App() {
  const [index, setIndex] = useState(0);
  const [atividade, setAtividade] = useState(initialState);
  const [atividades, setAtividades] = useState({id: 0});



  useEffect(() => {
      atividade.length <= 0 ? setIndex(1) : setIndex( Math.max.apply(Math, atividade.map(item => item.id) ) + 1,)
  },[atividade])

  function addAtividade(ativ){
    setAtividade([ ... atividade, { ... ativ, id:index }]);
  }

  function cancelarAtividade(){
    setAtividades({id: 0});
  }

  function deletarAtividade(id){
    const atividadesFiltradas = atividade.filter(atividade => atividade.id !== id);
    setAtividade([...atividadesFiltradas]);
  }

  function pegarAtividade(id){
      const atividadeEncontrada = atividade.filter(atividade => atividade.id === id);
      setAtividades(atividadeEncontrada[0])
  }

  function atualizarAtividade(ativ){
    setAtividade(atividade.map(item => item.id === ativ.id ? ativ : item));
    setAtividades({id: 0});
  }

  return (
    <Fragment>
        <AtividadeForm
          addAtividade={addAtividade}
          atualizarAtividade={atualizarAtividade}
          cancelarAtividade={cancelarAtividade}
          ativSelecionada={atividades}
          atividade={atividade}
        />
        <AtividadeLista 
          atividade={atividade}
          deletarAtividade ={deletarAtividade}
          pegarAtividade = {pegarAtividade}
        />
    </Fragment>
  );
}

export default App;
