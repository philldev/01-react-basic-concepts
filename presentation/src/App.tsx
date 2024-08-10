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
import DiffingAlgo from "./slides/03-how-rendering-works/4-diffing-algo";
import DiffingAlgo1 from "./slides/03-how-rendering-works/4.1-diffing-algo";
import DiffingAlgo2 from "./slides/03-how-rendering-works/4.2-diffing-algo";
import DiffingAlgo3 from "./slides/03-how-rendering-works/4.3-diffing-algo";
import DiffingAlgo4 from "./slides/03-how-rendering-works/4.4-diffing-algo";
import DiffingAlgo5 from "./slides/03-how-rendering-works/4.5-diffing-algo";
import DiffingAlgo6 from "./slides/03-how-rendering-works/4.6-diffing-algo";
import CommitTitle from "./slides/03-how-rendering-works/5-commit";
import Commit from "./slides/03-how-rendering-works/5.1-commit";
import DemoTitle from "./slides/04-demo/0-demo-title";
import DemoExample from "./slides/04-demo/1-demo-example";
import DemoFlow from "./slides/04-demo/2-demo-flow";
import Summary from "./slides/outro/summary";
import ThankYou from "./slides/outro/thankyou";

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
  DiffingAlgo,
  DiffingAlgo1,
  DiffingAlgo2,
  DiffingAlgo3,
  DiffingAlgo4,
  DiffingAlgo5,
  DiffingAlgo6,
  CommitTitle,
  Commit,
  DemoTitle,
  DemoExample,
] as const;

function App() {
  return (
    <Deck>
      {slides.map((Comp, index) => (
        <Slide key={index} element={<Comp />} />
      ))}
      <Slide className="p-10 px-4" element={<DemoFlow />} />
      <Slide element={<Summary />} />
      <Slide element={<ThankYou />} />
    </Deck>
  );
}

export default App;
