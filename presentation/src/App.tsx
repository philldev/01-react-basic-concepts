import Presentation from "./components/presentation";
import Slide from "./components/slide";
import Cover from "./slides/00-cover";
import Outline from "./slides/00.1-outline";
import WhatIsReact from "./slides/01-whatisreact";

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
    </Presentation>
  );
}

export default App;
