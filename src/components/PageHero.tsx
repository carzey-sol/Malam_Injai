'use client';

interface PageHeroProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  className?: string;
}

export default function PageHero({ title, subtitle, backgroundImage, className = '' }: PageHeroProps) {
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <section className={`page-hero ${className}`} style={backgroundStyle}>
      <div className="container">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
