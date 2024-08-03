import { useEffect, useRef } from "react";
import { Deck, Slide, Step, useDeck } from "./components/deck";

function App() {
  return (
    <Deck>
      <Slide element={<div>Slide 1</div>} />
      <Slide element={<Slide2 />} />
      <Slide element={<div>Slide 3</div>} />
      <Slide element={<div>Slide 4</div>} />
    </Deck>
  );
}

function useOnMount(callback: () => void) {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    callback();
  }, []);
}

function Slide2() {
  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    deckSteps.addStep(slideIndex, {
      id: "step-1",
      show: () => {
        console.log("step 1");
      },
      order: 0,
    });

    deckSteps.addStep(slideIndex, {
      id: "step-2",
      show: () => {
        console.log("step 2");
      },
      order: 1,
    });
  });

  return (
    <div>
      <h1>Slide 2</h1>
      <Step order={5}>
        <h1>Step 3</h1>
      </Step>
      <Step order={6}>
        <h1>Step 4</h1>
      </Step>
    </div>
  );
}

export default App;
