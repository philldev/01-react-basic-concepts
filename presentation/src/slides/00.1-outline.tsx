import Step from "@/components/step";

export default function Outline() {
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex flex-col gap-10">
        <h1 className="text-8xl font-medium">Outline</h1>
        <ul className="list-disc text-4xl list-inside gap-4 flex flex-col">
          <Step index={0}>
            <li>What is React?</li>
          </Step>
          <Step index={1}>
            <li>React basic concepts</li>
          </Step>
          <Step index={2}>
            <li>What is React Renderer?</li>
          </Step>
          <Step index={3}>
            <li>How React Rendering works?</li>
          </Step>
        </ul>
      </div>
    </div>
  );
}
