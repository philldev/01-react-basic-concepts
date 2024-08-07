import { SlideTitle } from "@/components/ui/slide-title";

// const steps = [
//   "React Element",
//   "React Component",
//   "Render Tree",
//   "State",
//   "Effects",
// ];

export default function BasicConceptsTitle() {
  return (
    <div className="flex flex-col justify-center h-full relative">
      <SlideTitle className="mb-8">
        Understanding React Basic Concepts
      </SlideTitle>
      {/* <ul className="list-disc list-inside flex flex-col gap-4"> */}
      {/*   {steps.map((step, index) => ( */}
      {/*     <Step key={index} order={index}> */}
      {/*       <SlideText asChild className="text-4xl"> */}
      {/*         <li>{step}</li> */}
      {/*       </SlideText> */}
      {/*     </Step> */}
      {/*   ))} */}
      {/* </ul> */}
    </div>
  );
}
