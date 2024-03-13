import { Canvas } from "@react-three/fiber";
import Object from "./components/Object";

function App() {
  return (
    <Canvas orthographic camera={{ zoom: 100, position: [0, 0, 5] }}>
      <Object />
    </Canvas>
  );
}

export default App;
