import reactLogo from "@/assets/react.svg";

export default function Cover() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-center text-7xl font-medium mb-10">
        React Core Concepts
      </h1>
      <img
        className="animate-spin-slow mb-10"
        src={reactLogo}
        alt="React Logo"
        width={200}
        height={200}
      />
      <div className="flex flex-col items-center text-muted-foreground">
        <p>By Deddy Wolley</p>
        <p>Weekendinc</p>
      </div>
    </div>
  );
}
