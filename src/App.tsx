import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import Object from "./components/Object";

function App() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <Object sides={3} radius={1} id="tri" startPosition={[1, 1]} />
      <Object sides={4} radius={1} id="square" startPosition={[-1, 3]} />
      <Object sides={5} radius={1} id="penta" startPosition={[2, 3]} />
      <Object sides={6} radius={1} id="hexa" startPosition={[-4, -0.5]} />
      <Object sides={32} radius={1} id="circle" startPosition={[-2, -2]} />
    </Canvas>
  );
}

export default App;
