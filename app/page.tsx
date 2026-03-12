import Link from 'next/link';

export default function Home() {
  return (
    <div 
      className="hero min-h-screen"
      style={{ backgroundImage: 'url(/backdrop.jpg)' }}
    >
      <div className="hero-overlay bg-black/60 backdrop-blur-xs"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-5">Hello there</h1>
          <p className="mb-5">
            Welcome to my website. Feel free to explore the collection of board games I have compiled.
          </p>
          <Link href="/boardgames" className="btn btn-primary">
            To the boardgames!
          </Link>
        </div>
      </div>
    </div>
  );
}
