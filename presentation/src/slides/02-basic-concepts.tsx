import Step from "@/components/step";
import { SVGProps } from "react";

export default function BasicConcepts() {
  return (
    <div className="flex flex-col justify-center h-full relative">
      <h1 className="w-full text-8xl font-medium left-0 top-0 mb-8">
        Basic Concepts
      </h1>
      <ul className="list-disc text-4xl list-inside flex flex-col gap-4 ml-4">
        <Step index={0}>
          <li>React Element</li>
        </Step>
        <Step index={1}>
          <li>React Component</li>
        </Step>
        <Step index={2}>
          <li>Render Tree</li>
        </Step>
        <Step index={3}>
          <li>State</li>
        </Step>
        <Step index={4}>
          <li>Effects</li>
        </Step>
      </ul>
    </div>
  );
}
