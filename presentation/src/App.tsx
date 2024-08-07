import { Deck, Slide } from "./components/deck";
import Cover from "./slides/00-cover/0-title";
import Outline from "./slides/00-cover/1-outline";
import IntroTitle from "./slides/01-intro/0-title";
import BasicConceptsTitle from "./slides/02-basic-concepts/0-title";
import ReactElement from "./slides/02-basic-concepts/1-react-element";
import ReactComponent from "./slides/02-basic-concepts/2-react-component";
import ReactState from "./slides/02-basic-concepts/3-react-state";
import ReactEffects from "./slides/02-basic-concepts/4-react-effects";
import RenderTree from "./slides/02-basic-concepts/5-render-tree";
import HowRenderingWorksTitle from "./slides/03-how-rendering-works/0-title";
import RenderingSteps from "./slides/03-how-rendering-works/1-rendering-steps";
import Trigger from "./slides/03-how-rendering-works/2-trigger";
import Trigger0 from "./slides/03-how-rendering-works/2.0-trigger";
import Trigger1 from "./slides/03-how-rendering-works/2.1-trigger";
import Reconciliation from "./slides/03-how-rendering-works/3-reconciliation";

const slides = [
  Cover,
  Outline,
  IntroTitle,
  BasicConceptsTitle,
  ReactElement,
  ReactComponent,
  ReactState,
  ReactEffects,
  RenderTree,
  HowRenderingWorksTitle,
  RenderingSteps,
  Trigger,
  Trigger0,
  Trigger1,
  Reconciliation,
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
