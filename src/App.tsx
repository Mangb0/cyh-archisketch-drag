import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import Object from "./components/Object";

function App() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <Object sides={3} id="tri" startPosition={[1, 1, 0]} color="skyblue" />
      <Object sides={4} id="square" startPosition={[-1, 3, 0]} color="orange" />
      <Object sides={5} id="penta" startPosition={[2, 3, 0]} color="blue" />
      <Object sides={6} id="hexa" startPosition={[-4, -0.5, 0]} color="black" />
      <Object sides={32} id="circle" startPosition={[-2, -2, 0]} color="pink" />
    </Canvas>
  );
}

export default App;
