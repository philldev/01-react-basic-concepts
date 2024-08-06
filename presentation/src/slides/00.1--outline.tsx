import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";

const outlines = [
  "What is React?",
  "React basic concepts",
  "How React Rendering works?",
];

export default function Outline() {
  return (
    <div className="flex flex-col gap-10 h-full justify-center">
      <SlideHeading>Outline</SlideHeading>
      <ul className="list-disc text-4xl list-inside gap-4 flex flex-col">
        {outlines.map((outline, index) => (
          <SlideText key={index} className="text-4xl" asChild>
            <li>{outline}</li>
          </SlideText>
        ))}
      </ul>
    </div>
  );
}
