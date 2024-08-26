import uniqueKey_1000 from "../../assets/key-perf/1000/withkey.png";
import uniqueKey_5000 from "../../assets/key-perf/5000/withkey.png";
import uniqueKey_10000 from "../../assets/key-perf/10000/withkey.png";

import withIndex_1000 from "../../assets/key-perf/1000/withoutkey.png";
import withIndex_5000 from "../../assets/key-perf/5000/withoutkey.png";
import withIndex_10000 from "../../assets/key-perf/10000/withoutkey.png";

import { SlideSubheading } from "@/components/ui/slide-subheading";

const usingIndex = [
  { name: "1000", img: withIndex_1000 },
  { name: "5000", img: withIndex_5000 },
  { name: "10000", img: withIndex_10000 },
];

const usingUniqueKey = [
  { name: "1000", img: uniqueKey_1000 },
  { name: "5000", img: uniqueKey_5000 },
  { name: "10000", img: uniqueKey_10000 },
];

export default function DiffingAlgo4_5_2() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-10 flex-1">
        <div className="flex flex-col gap-4">
          <SlideSubheading className="text-foreground/80">
            Using index as key
          </SlideSubheading>
          <div className="flex gap-8">
            {usingIndex.map(({ name, img }) => (
              <div className="flex-1 flex flex-col gap-2" key={name}>
                <img src={img} className="w-full" />
                <p className="text-sm text-foreground/80">{name} items</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <SlideSubheading className="text-foreground/80">
            Using unique id as key
          </SlideSubheading>
          <div className="flex gap-8">
            {usingUniqueKey.map(({ name, img }) => (
              <div className="flex-1 flex flex-col gap-2" key={name}>
                <img src={img} className="w-full" />
                <p className="text-sm text-foreground/80">{name} items</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
