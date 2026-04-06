export const HomePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <h1 className="text-3xl font-semibold tracking-tight">kit_vibe_coding</h1>
      <p className="max-w-md text-center text-slate-600 dark:text-slate-400">
        React + TypeScript + Vite. 개발 규칙은{' '}
        <code className="rounded bg-slate-200 px-1.5 py-0.5 text-sm dark:bg-slate-800">
          frontend_rules.md
        </code>
        를 따릅니다.
      </p>
    </main>
  )
}
