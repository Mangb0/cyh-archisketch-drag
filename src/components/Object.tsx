import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useGesture } from "react-use-gesture";
import { Mesh } from "three";

function Object() {
  const meshRef = useRef<Mesh>(null);
  const { size, viewport } = useThree();

  const aspect = size.width / viewport.width;

  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      meshRef.current?.position.set(x / aspect, -y / aspect, 0);
    },
  });
  return (
    <>
      <mesh ref={meshRef} {...bind()}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="orange" />
      </mesh>
    </>
  );
}

export default Object;
