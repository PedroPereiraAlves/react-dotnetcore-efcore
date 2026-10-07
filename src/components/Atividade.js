import { useEffect, useId, useRef, useState } from 'react';
import { obterPrioridade } from '../atividade';

export default function Atividade({ atividade, selecionada, onEditar, onExcluir }) {
  const [confirmando, setConfirmando] = useState(false);
  const cancelarRef = useRef(null);
  const perguntaId = useId();
  const prioridade = obterPrioridade(atividade.prioridade);

  useEffect(() => {
    if (!confirmando) {
      return undefined;
    }

    cancelarRef.current?.focus();

    function cancelarComEscape(event) {
      if (event.key === 'Escape') {
        setConfirmando(false);
      }
    }

    document.addEventListener('keydown', cancelarComEscape);
    return () => document.removeEventListener('keydown', cancelarComEscape);
  }, [confirmando]);

  return (
    <li className={selecionada ? 'atividade-selecionada' : undefined}>
      <article
        className={`card mb-2 shadow-sm border-${prioridade.badge}`}
        aria-current={selecionada ? 'true' : undefined}
      >
        <div className="card-body">
          <div className="d-flex justify-content-between gap-3 flex-wrap">
            <h3 className="card-title h5 mb-0">
              <span className="badge text-bg-secondary me-2">{atividade.id}</span>
              {atividade.titulo}
            </h3>
            <p className="mb-0">
              <span className="visually-hidden">Prioridade: </span>
              <span className={`badge text-bg-${prioridade.badge}`}>
                <i className={`me-1 far fa-${prioridade.icone}`} aria-hidden="true" />
                {prioridade.label}
              </span>
            </p>
          </div>
          {atividade.descricao && (
            <p className="card-text mt-3 mb-0">{atividade.descricao}</p>
          )}
          <div className="d-flex justify-content-end pt-2 mt-3 border-top">
            {confirmando ? (
              <div role="group" aria-labelledby={perguntaId}>
                <span id={perguntaId} className="me-2">
                  Excluir esta atividade?
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger me-2"
                  onClick={() => onExcluir(atividade.id)}
                >
                  Confirmar exclusão
                </button>
                <button
                  ref={cancelarRef}
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setConfirmando(false)}
                >
                  Manter
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => onEditar(atividade.id)}
                >
                  <i className="fas fa-pen me-2" aria-hidden="true" />
                  Editar
                  <span className="visually-hidden"> {atividade.titulo}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setConfirmando(true)}
                >
                  <i className="fas fa-trash me-2" aria-hidden="true" />
                  Excluir
                  <span className="visually-hidden"> {atividade.titulo}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}
