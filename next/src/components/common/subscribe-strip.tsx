export function SubscribeStrip() {
  return (
    <section className="bg-primary rounded-lg px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="font-body text-base text-on-primary">
        Get the daily intelligence digest in your inbox.
      </p>
      <div className="flex items-center gap-3">
        <input
          type="email"
          placeholder="you@company.com"
          className="bg-white text-primary rounded-[var(--radius-default)] px-4 py-2 font-mono text-sm w-64"
        />
        <button className="bg-secondary text-on-secondary font-mono text-xs uppercase px-5 py-2.5 rounded-[var(--radius-default)] hover:opacity-90 active:scale-95 transition-all">
          SUBSCRIBE
        </button>
      </div>
      <p className="font-mono text-[10px] text-slate-gray">Powered by Resend</p>
    </section>
  );
}
