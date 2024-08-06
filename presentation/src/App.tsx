import { Deck, Slide } from "./components/deck";

import Cover from "./slides/00.0--cover";
import Outline from "./slides/00.1--outline";
import WhatIsReact from "./slides/01.0--intro";
import BasicConcepts from "./slides/02.0--basic-concepts";
import ReactElement from "./slides/02.1--react-element";
import ReactComponent from "./slides/02.3--react-component";
import ReactState from "./slides/02.4--react-state";
import ReactEffects from "./slides/02.5--react-effects";
import RenderTree from "./slides/02.6--render-tree";
import ReactRendering from "./slides/03.0--react-rendering";
import Trigger from "./slides/03.1--trigger";
import Render from "./slides/03.2--render";

const slides = [
  Cover,
  Outline,
  WhatIsReact,
  BasicConcepts,
  ReactElement,
  ReactComponent,
  ReactState,
  ReactEffects,
  RenderTree,
  ReactRendering,
  Trigger,
  Render,
] as const;

function App() {
  return (
    <Deck>
      {slides.map((Comp, index) => (
        <Slide key={index} element={<Comp />} />
      ))}
    </Deck>
  );
}

export default App;
