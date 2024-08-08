import { Step } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";

export default function DiffingAlgo6() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">
          Rules for Using React Keys ⚠️
        </SlideHeading>
        <ul className="text-2xl flex flex-col gap-4 list-disc list-outside max-w-2xl">
          <Step>
            <li>
              Each key must be unique among its siblings. A key should uniquely
              identify a list item among its siblings to help React distinguish
              between items.
            </li>
          </Step>
          <Step>
            <li>
              Keys should be stable, meaning they should not change over time.
              Using a stable key helps maintain the component’s identity across
              renders, preserving the state correctly.
            </li>
          </Step>
          <Step>
            <li>
              Avoid using array indexes as keys if the list items can be
              reordered, added, or removed. Using indexes can lead to
              performance issues and bugs because React cannot reliably track
              changes.
            </li>
          </Step>
        </ul>
      </div>
    </div>
  );
}
