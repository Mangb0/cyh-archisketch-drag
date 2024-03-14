import { useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useGesture } from "react-use-gesture";
import * as THREE from "three";

interface Props {
  sides: number;
  id: string;
  startPosition: [number, number, number];
  color: string;
}

function Object({ sides, id, startPosition, color }: Props) {
  // Mesh ref 생성
  const meshRef = useRef<THREE.Mesh>(null);

  // canvas, viewport 크기 정보
  const { size, viewport } = useThree();

  // 다각형 Shape 생성
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    points.push(new THREE.Vector2(Math.cos(angle), Math.sin(angle)));
  }
  const shape = new THREE.Shape(points);

  // 화면 비율 계산
  const aspect = size.width / viewport.width;

  // 드래그 이벤트
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      meshRef.current?.position.set(
        startPosition[0] + x / aspect,
        startPosition[1] - y / aspect,
        0
      );
    },
  });

  return (
    <mesh
      ref={meshRef}
      name={id}
      position={startPosition}
      rotation={[0, 0, -Math.PI / 2 + Math.PI / sides]}
      {...bind()}
    >
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

export default Object;
