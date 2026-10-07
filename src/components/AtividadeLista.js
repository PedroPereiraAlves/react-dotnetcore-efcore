import Atividade from './Atividade';

export default function AtividadeLista({
  atividades,
  selecionadaId,
  onEditar,
  onExcluir,
}) {
  return (
    <section className="mt-4" aria-labelledby="lista-atividades">
      <h2 id="lista-atividades" className="h5">
        Lista
        <span className="text-muted fw-normal"> ({atividades.length})</span>
      </h2>
      {atividades.length === 0 ? (
        <p className="text-muted" role="status">
          Nenhuma atividade cadastrada. Use o formulário acima para adicionar a primeira.
        </p>
      ) : (
        <ul className="list-unstyled mb-0">
          {atividades.map((atividade) => (
            <Atividade
              key={atividade.id}
              atividade={atividade}
              selecionada={atividade.id === selecionadaId}
              onEditar={onEditar}
              onExcluir={onExcluir}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
