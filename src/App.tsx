import { OrbitControls, Plane } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 5] }}>
      <Plane args={[5, 5]} />
      <OrbitControls />
    </Canvas>
  );
}

export default App;
