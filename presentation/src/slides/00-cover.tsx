import reactLogo from "@/assets/react.svg";

export default function Cover() {
  return (
    <div className="flex h-full relative flex-col justify-center">
      <div className="flex gap-10">
        <img
          className="animate-spin-slow mb-10"
          src={reactLogo}
          alt="React Logo"
          width={100}
          height={100}
        />

        <h1 className="text-left text-8xl font-medium mb-10">Core Concepts</h1>
      </div>
      <h2 className="text-left text-4xl mb-10">
        How React works under the hood
      </h2>
      <div className="flex flex-col absolute bottom-0 left-0 text-muted-foreground">
        <p>By Deddy Wolley</p>
        <p>Weekendinc</p>
      </div>
    </div>
  );
}
