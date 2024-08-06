import { Step } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";

const steps = [
  "React Element",
  "React Component",
  "Render Tree",
  "State",
  "Effects",
];

export default function BasicConcepts() {
  return (
    <div className="flex flex-col justify-center h-full relative">
      <SlideHeading className="mb-8">Basic Concepts</SlideHeading>
      <ul className="list-disc list-inside flex flex-col gap-4">
        {steps.map((step, index) => (
          <Step key={index} order={index}>
            <SlideText asChild className="text-4xl">
              <li>{step}</li>
            </SlideText>
          </Step>
        ))}
      </ul>
    </div>
  );
}
