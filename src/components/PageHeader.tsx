import Link from 'next/link'

type Props = {
  activeTab: 'pregrado' | 'posgrado' | 'profes'
}

function TabLink({
  href,
  label,
  active,
}: {
  href: string
  label: string
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2 font-display text-sm font-black tracking-widest transition-colors ${
        active
          ? 'bg-black text-white'
          : 'bg-neutral-100 text-black hover:bg-neutral-200'
      }`}
    >
      {label}
    </Link>
  )
}

export default function PageHeader({ activeTab }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group flex items-baseline gap-3">
          <h1 className="font-display text-3xl font-black leading-none tracking-tight transition-colors group-hover:text-facu-green">
            Cursos
          </h1>
          <span className="hidden font-display text-sm font-medium text-neutral-500 sm:inline">
            Facultad de Educación
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <TabLink href="/pregrado" label="PREGRADO" active={activeTab === 'pregrado'} />
          <TabLink href="/posgrado" label="POSGRADO" active={activeTab === 'posgrado'} />
          <span className="mx-1 h-5 w-px bg-neutral-200" />
          <TabLink href="/profes" label="PROFES" active={activeTab === 'profes'} />
        </nav>
      </div>
    </header>
  )
}
