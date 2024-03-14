import { useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
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

  // 드래그 이동 Mesh 위치
  const [position, setPosition] = useState<THREE.Vector3 | null>(null);

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
    onDragStart: () => {
      if (meshRef.current) {
        setPosition(meshRef.current.position);
      }
    },
    onDrag: ({ offset: [x, y] }) => {
      const newX = startPosition[0] + x / aspect;
      const newY = startPosition[1] + -y / aspect;
      setPosition(new THREE.Vector3(newX, newY, 0));
    },
    onDragEnd: () => {
      if (meshRef.current && position) {
        meshRef.current.position.copy(position);
        setPosition(null);
      }
    },
  });

  return (
    <>
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
      {position && (
        <mesh
          position={position}
          rotation={[0, 0, -Math.PI / 2 + Math.PI / sides]}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial wireframe={true} />
        </mesh>
      )}
    </>
  );
}

export default Object;
