import { SlideText } from "@/components/ui/slide-text";

export default function RenderingSteps() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 mb-20">
        <SlideText className="flex-1">
          React's rendering process consists of three steps:
        </SlideText>
      </div>

      <ol className="flex flex-col list-decimal list-inside text-7xl font-bold gap-4">
        <li>Trigger 🚀</li>
        <li>Reconciliation 🔄</li>
        <li>Commit 🎨</li>
      </ol>
    </div>
  );
}
