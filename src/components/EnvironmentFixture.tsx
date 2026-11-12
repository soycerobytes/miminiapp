import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import { validateLabel } from '../lib/validation';

export default function EnvironmentFixture() {
  const fixtureRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [label, setLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmedLabel, setConfirmedLabel] = useState<string | null>(null);

  useEffect(() => {
    fixtureRef.current?.setAttribute('data-hydrated', 'true');
  }, []);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateLabel(label);

    if (!result.ok) {
      setError(result.error);
      setConfirmedLabel(null);
      inputRef.current?.focus();
      return;
    }

    setLabel(result.value);
    setError(null);
    setConfirmedLabel(result.value);
  }

  function handleReset() {
    setLabel('');
    setError(null);
    setConfirmedLabel(null);
    inputRef.current?.focus();
  }

  return (
    <section
      ref={fixtureRef}
      aria-labelledby="fixture-title"
      data-testid="environment-fixture"
      data-hydrated="false"
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
    >
      <div
        data-testid="fixture-layout"
        className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-14"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wide text-teal-800">
            Base local · I-01
          </p>
          <h2
            id="fixture-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-slate-950"
          >
            Una interacción para comprobar la base
          </h2>
          <p className="mt-4 leading-7 text-slate-700">
            Escribe una etiqueta, comprueba el resultado y restablece el
            formulario. Esta página provisional permite verificar la
            interactividad y los estilos del entorno.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            La etiqueta solo se utiliza en esta página. No se guarda ni se
            envía.
          </p>
          <div className="mt-7 inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-900">
            Fixture técnica
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="min-w-0"
        >
          <label
            htmlFor="test-label"
            className="block text-sm font-semibold text-slate-900"
          >
            Etiqueta de prueba
          </label>
          <p id="test-label-hint" className="mt-2 text-sm text-slate-600">
            Usa entre 3 y 32 caracteres. Los espacios repetidos se simplifican.
          </p>
          <input
            ref={inputRef}
            id="test-label"
            name="test-label"
            type="text"
            value={label}
            autoComplete="off"
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? 'test-label-hint test-label-error' : 'test-label-hint'
            }
            onChange={(event) => {
              setLabel(event.target.value);
              setError(null);
              setConfirmedLabel(null);
            }}
            className="mt-3 min-h-12 w-full min-w-0 rounded-xl border border-slate-500 bg-white px-4 py-3 text-base text-slate-950 outline-none focus-visible:border-teal-700 focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 aria-invalid:border-red-700"
          />
          {error && (
            <p
              id="test-label-error"
              role="alert"
              className="mt-3 text-sm font-medium text-red-800"
            >
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="min-h-12 rounded-xl bg-teal-800 px-5 py-3 font-semibold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
            >
              Comprobar
            </button>
            <button
              type="reset"
              className="min-h-12 rounded-xl border border-slate-500 bg-white px-5 py-3 font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800"
            >
              Restablecer
            </button>
          </div>
          <p
            role="status"
            aria-atomic="true"
            className="mt-6 min-h-7 break-words font-medium text-teal-900"
          >
            {confirmedLabel !== null &&
              `Etiqueta confirmada: ${confirmedLabel}`}
          </p>
        </form>
      </div>
    </section>
  );
}
