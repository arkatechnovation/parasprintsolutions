// Keep content server-rendered. One small observer enhances below-fold reveals.
export default function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`reveal ${className}`.trim()} data-reveal-delay={Math.min(delay, 0.24)}>
      {children}
    </div>
  );
}
