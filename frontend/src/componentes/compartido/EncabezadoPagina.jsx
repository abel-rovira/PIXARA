import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PageHeader({ eyebrow, title, text, actionLabel, actionTo }) {
  return (
    <header className="page-hero">
      {eyebrow && <span>{eyebrow}</span>}
      <h1>{title}</h1>
      {text && <p>{text}</p>}
      {actionLabel && actionTo && (
        <Link className="hero-secondary" to={actionTo}>
          {actionLabel}<ArrowRight size={18} />
        </Link>
      )}
    </header>
  );
}

