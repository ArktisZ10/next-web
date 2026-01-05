export default function Home() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Welcome to my website. Feel free to explore the collection of board games I have compiled.
          </p>
          <a href="/boardgames" className="btn btn-primary">To the boardgames!</a>
        </div>
      </div>
    </div>
  );
}
