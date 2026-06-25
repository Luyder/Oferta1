import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Decorative green corner accent */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-facu-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-facu-green/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        {/* Title block */}
        <header className="mb-12">
          <h1 className="font-display text-7xl font-black leading-[0.9] tracking-tight sm:text-8xl">
            Cursos
          </h1>
          <p className="mt-2 font-display text-2xl font-medium text-neutral-700 sm:text-3xl">
            Facultad de Educación
          </p>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-facu-green" />
        </header>

        {/* Navigation buttons */}
        <nav className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/pregrado"
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl bg-black px-6 py-10 text-center transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-facu-green translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative font-display text-3xl font-black tracking-widest text-white">
                PREGRADO
              </span>
            </Link>
            <Link
              href="/posgrado"
              className="group relative flex items-center justify-center overflow-hidden rounded-2xl bg-black px-6 py-10 text-center transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="absolute inset-0 bg-facu-green translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative font-display text-3xl font-black tracking-widest text-white">
                POSGRADO
              </span>
            </Link>
          </div>

          <Link
            href="/profes"
            className="group relative mx-auto flex w-full items-center justify-center overflow-hidden rounded-2xl bg-black px-6 py-7 text-center transition-transform duration-200 hover:-translate-y-1 sm:w-2/3"
          >
            <span className="absolute inset-0 bg-facu-green translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
            <span className="relative font-display text-2xl font-black tracking-widest text-white">
              PROFES
            </span>
          </Link>
        </nav>

        {/* Logo institucional */}
        <div className="mt-16 flex justify-center sm:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-faceduc.png"
            alt="Universidad de los Andes · Facultad de Educación · 10 años transformando la educación"
            className="h-16 w-auto sm:h-20 invert"
          />
        </div>
      </div>
    </div>
  )
}
