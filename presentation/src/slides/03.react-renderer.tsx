const rendererList = [
  {
    platform: "Web",
    renderers: ["react-dom", "react-tiny-dom"],
  },
  {
    platform: "Mobile",
    renderers: ["react-native", "react-titanium"],
  },
  {
    platform: "Desktop",
    renderers: ["proton-native", "react-gtk"],
  },
  {
    platform: "3D",
    renderers: ["react-three-fiber", "react-babylonjs", "react-unity"],
  },
  {
    platform: "TV",
    renderers: ["react-tv", "react-tvml", "react-ape"],
  },
];

export default function ReactRenderer() {
  return (
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">React Renderer</h1>
      <p className="text-2xl text-foreground/80 mb-20">
        React Renderer is a core part of React. It is responsible for managing
        and updating the UI in response to changes in data or state.
      </p>

      <div className="flex gap-2">
        {rendererList.map(({ platform, renderers }) => (
          <div key={platform} className="flex flex-1 flex-col gap-2 text-xl">
            <h3 className="font-light text-4xl">{platform}</h3>
            <ul className="list-disc list-inside font-mono">
              {renderers.map((renderer) => (
                <li key={renderer}>{renderer}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
