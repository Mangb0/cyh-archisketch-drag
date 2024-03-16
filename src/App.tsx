import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import DragShape from "./components/DragShape";

function App() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <DragShape sides={3} radius={1} id="tri" startPosition={[1, 1]} />
      <DragShape sides={4} radius={1} id="square" startPosition={[-1, 3]} />
      <DragShape sides={5} radius={1} id="penta" startPosition={[2, 3]} />
      <DragShape sides={6} radius={1} id="hexa" startPosition={[-4, -0.5]} />
      <DragShape sides={32} radius={1} id="circle" startPosition={[-2, -2]} />
    </Canvas>
  );
}

export default App;
