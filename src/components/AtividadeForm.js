import { useEffect, useId, useRef, useState } from 'react';
import {
  LIMITES,
  PRIORIDADES,
  atividadeVazia,
  normalizarAtividade,
  validarAtividade,
} from '../atividade';

const campos = ['titulo', 'prioridade', 'descricao'];

export default function AtividadeForm({
  atividadeSelecionada,
  onAdicionar,
  onAtualizar,
  onCancelar,
}) {
  const baseId = useId();
  const tituloRef = useRef(null);
  const prioridadeRef = useRef(null);
  const descricaoRef = useRef(null);
  const refs = {
    titulo: tituloRef,
    prioridade: prioridadeRef,
    descricao: descricaoRef,
  };
  const [atividade, setAtividade] = useState(atividadeSelecionada);
  const [erros, setErros] = useState({});
  const [selecaoAtual, setSelecaoAtual] = useState(atividadeSelecionada);
  const editando = atividade.id !== 0;
  const temErros = Object.keys(erros).length > 0;

  if (selecaoAtual !== atividadeSelecionada) {
    setSelecaoAtual(atividadeSelecionada);
    setAtividade(atividadeSelecionada.id !== 0 ? atividadeSelecionada : atividadeVazia);
    setErros({});
  }

  useEffect(() => {
    if (atividadeSelecionada.id !== 0) {
      tituloRef.current?.focus();
    }
  }, [atividadeSelecionada]);

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setAtividade((atual) => ({ ...atual, [name]: value }));
    setErros((atual) => {
      if (!atual[name]) {
        return atual;
      }
      const seguintes = { ...atual };
      delete seguintes[name];
      return seguintes;
    });
  }

  function limparFormulario() {
    setAtividade(atividadeVazia);
    setErros({});
    tituloRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    const encontrados = validarAtividade(atividade);
    setErros(encontrados);

    const primeiroInvalido = campos.find((campo) => encontrados[campo]);
    if (primeiroInvalido) {
      refs[primeiroInvalido].current?.focus();
      return;
    }

    const normalizada = normalizarAtividade(atividade);
    if (editando) {
      onAtualizar(normalizada);
    } else {
      onAdicionar(normalizada);
    }
    limparFormulario();
  }

  function handleCancelar() {
    onCancelar();
    limparFormulario();
  }

  function campoInvalido(nome) {
    return erros[nome] ? 'true' : undefined;
  }

  return (
    <section aria-labelledby={`${baseId}-titulo-secao`}>
      <h2 id={`${baseId}-titulo-secao`} className="h4">
        {editando ? `Editar atividade ${atividade.id}` : 'Nova atividade'}
      </h2>
      <p className="text-muted">Título e prioridade são obrigatórios. A descrição é opcional.</p>
      {temErros && (
        <div className="alert alert-danger" role="alert">
          Revise os campos destacados antes de salvar.
        </div>
      )}
      <form className="row g-3" onSubmit={handleSubmit} noValidate>
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${baseId}-titulo`}>
            Título
          </label>
          <input
            ref={tituloRef}
            id={`${baseId}-titulo`}
            name="titulo"
            type="text"
            className={`form-control${erros.titulo ? ' is-invalid' : ''}`}
            value={atividade.titulo}
            onChange={atualizarCampo}
            maxLength={LIMITES.titulo}
            aria-required="true"
            aria-invalid={campoInvalido('titulo')}
            aria-describedby={erros.titulo ? `${baseId}-titulo-erro` : undefined}
            autoComplete="off"
          />
          {erros.titulo && (
            <div id={`${baseId}-titulo-erro`} className="invalid-feedback">
              {erros.titulo}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor={`${baseId}-prioridade`}>
            Prioridade
          </label>
          <select
            ref={prioridadeRef}
            id={`${baseId}-prioridade`}
            name="prioridade"
            className={`form-select${erros.prioridade ? ' is-invalid' : ''}`}
            value={atividade.prioridade}
            onChange={atualizarCampo}
            aria-required="true"
            aria-invalid={campoInvalido('prioridade')}
            aria-describedby={erros.prioridade ? `${baseId}-prioridade-erro` : undefined}
          >
            <option value="">Selecione...</option>
            {Object.entries(PRIORIDADES).map(([valor, prioridade]) => (
              <option key={valor} value={valor}>
                {prioridade.label}
              </option>
            ))}
          </select>
          {erros.prioridade && (
            <div id={`${baseId}-prioridade-erro`} className="invalid-feedback">
              {erros.prioridade}
            </div>
          )}
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor={`${baseId}-descricao`}>
            Descrição
          </label>
          <textarea
            ref={descricaoRef}
            id={`${baseId}-descricao`}
            name="descricao"
            className={`form-control${erros.descricao ? ' is-invalid' : ''}`}
            value={atividade.descricao}
            onChange={atualizarCampo}
            maxLength={LIMITES.descricao}
            rows={3}
            aria-invalid={campoInvalido('descricao')}
            aria-describedby={erros.descricao ? `${baseId}-descricao-erro` : `${baseId}-descricao-ajuda`}
          />
          <div id={`${baseId}-descricao-ajuda`} className="form-text">
            Opcional. Até {LIMITES.descricao} caracteres.
          </div>
          {erros.descricao && (
            <div id={`${baseId}-descricao-erro`} className="invalid-feedback">
              {erros.descricao}
            </div>
          )}
        </div>
        <div className="col-12">
          {editando ? (
            <>
              <button className="btn btn-outline-success me-2" type="submit">
                <i className="fas fa-check me-2" aria-hidden="true" />
                Salvar alterações
              </button>
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleCancelar}
              >
                <i className="fas fa-xmark me-2" aria-hidden="true" />
                Cancelar edição
              </button>
            </>
          ) : (
            <button className="btn btn-outline-secondary" type="submit">
              <i className="fas fa-plus me-2" aria-hidden="true" />
              Adicionar atividade
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
