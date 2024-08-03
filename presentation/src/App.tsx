import Presentation from "./components/presentation";
import Slide from "./components/slide";
import Cover from "./slides/00-cover";
import Outline from "./slides/00.1-outline";
import WhatIsReact from "./slides/01-intro";
import BasicConcepts from "./slides/02-basic-concepts";
import ReactElement from "./slides/02.1-react-element";
import ReactComponent from "./slides/02.3-react-component";
import ReactState from "./slides/02.4-react-state";
import StateInReact from "./slides/02.5.2-react-state";
import ReactEffects from "./slides/02.6-react-effects";
import RenderTree from "./slides/02.7-render-tree";
import RenderTreeExample from "./slides/02.7.2-render-tree";
import ReactRenderer from "./slides/03.react-renderer";
import ReactRenderingProcess from "./slides/04-react-rendering-process";
import Trigger from "./slides/04.1-trigger";
import Render from "./slides/04.2-render";

function App() {
  return (
    <Presentation>
      <Slide>
        <Cover />
      </Slide>
      <Slide>
        <Outline />
      </Slide>
      <Slide>
        <WhatIsReact />
      </Slide>
      <Slide>
        <BasicConcepts />
      </Slide>
      <Slide>
        <ReactElement />
      </Slide>
      <Slide>
        <ReactComponent />
      </Slide>
      <Slide>
        <ReactState />
      </Slide>
      <Slide>
        <StateInReact />
      </Slide>
      <Slide>
        <ReactEffects />
      </Slide>

      <Slide>
        <RenderTree />
      </Slide>

      <Slide>
        <RenderTreeExample />
      </Slide>

      <Slide>
        <ReactRenderer />
      </Slide>

      <Slide>
        <ReactRenderingProcess />
      </Slide>

      <Slide>
        <Trigger />
      </Slide>

      <Slide>
        <Render />
      </Slide>
    </Presentation>
  );
}

export default App;
