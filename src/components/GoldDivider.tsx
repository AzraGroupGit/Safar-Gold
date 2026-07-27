export default function GoldDivider() {
  return (
    <div className="relative h-px w-full bg-border/40">
      <div className="absolute left-1/2 top-1/2 h-px w-24 -translate-x-1/2 -translate-y-1/2 gold-gradient-bg" />
    </div>
  );
}
