import { PANEL_PLACEHOLDER_ID } from "@/lib/constants";

export function PlaceholderContent() {
  return (
    <section id={PANEL_PLACEHOLDER_ID} className="bg-[#fbfaf7] px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-plum/75">
            Siguiente sección
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-graphite sm:text-5xl">
            Aquí empieza el sitio normal.
          </h2>
        </div>
        <div className="grid gap-4 text-lg leading-8 text-graphite/68">
          <p>
            Este bloque queda como placeholder para integrar más adelante el contenido real:
            casos, servicios, contacto o una narrativa extendida del recorrido de Catherine.
          </p>
          <p>
            El hero funciona como puerta de entrada y puede mantenerse como componente aislado
            dentro de un sitio más grande.
          </p>
        </div>
      </div>
    </section>
  );
}
