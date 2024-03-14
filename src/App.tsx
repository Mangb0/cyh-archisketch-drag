import { Canvas } from "@react-three/fiber";
import Object from "./components/Object";
import { OrthographicCamera } from "@react-three/drei";

function App() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 5]} zoom={100} />
      <Object />
    </Canvas>
  );
}

export default App;
