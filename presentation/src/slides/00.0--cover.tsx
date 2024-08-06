export default function Cover() {
  return (
    <div className="flex h-full relative flex-col justify-center">
      <div className="flex gap-10">
        <h1 className="text-left text-9xl font-medium mb-10">
          React Core Concepts
        </h1>
      </div>
      <h2 className="text-left text-4xl mb-10 text-foreground/50">
        How React works under the hood
      </h2>
      <div className="flex flex-col absolute bottom-0 left-0 text-muted-foreground">
        <p>Deddy Wolley</p>
        <p>Weekendinc</p>
      </div>
    </div>
  );
}
