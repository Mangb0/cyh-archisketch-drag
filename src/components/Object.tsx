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
  // clone Mesh ref 생성
  const cloneMeshRef = useRef<THREE.Mesh>(null);

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);

  // canvas, viewport 크기 및 scene 정보
  const { size, viewport, scene } = useThree();

  // 다각형 Shape 생성
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    points.push(new THREE.Vector2(Math.cos(angle), Math.sin(angle)));
  }
  const shape = new THREE.Shape(points);

  // 화면 비율 계산
  const aspect = size.width / viewport.width;

  // 스냅 기준 거리
  const snapThreshold = 0.5;

  // 드래그 이벤트
  const bind = useGesture({
    onDragStart: () => {
      setIsDragging(true);
    },
    onDrag: ({ offset: [x, y] }) => {
      if (!cloneMeshRef.current) return;

      // 드래그 중인 Mesh의 x, y 좌표 계산
      const xPos = startPosition[0] + x / aspect;
      const yPos = startPosition[1] + -y / aspect;

      // 가장 가까운 Mesh 정보 변수
      let closestXDistance = Infinity;
      let closestX = null;
      let closestYDistance = Infinity;
      let closestY = null;

      const movingBox = new THREE.Box3().setFromObject(cloneMeshRef.current!);
      const boxSize = movingBox.getSize(new THREE.Vector3());

      scene.children.forEach((child) => {
        if (!(child instanceof THREE.Mesh) || child.name.includes(id)) return;
        const targetBox = new THREE.Box3().setFromObject(child);

        // Mesh 중앙 snap
        const targetBoxCenter = targetBox.getCenter(new THREE.Vector3());
        const distanceX = Math.abs(targetBoxCenter.x - xPos);
        const distanceY = Math.abs(targetBoxCenter.y - yPos);
        if (distanceX < closestXDistance && distanceX < snapThreshold) {
          closestXDistance = distanceX;
          closestX = targetBoxCenter.x;
        }
        if (distanceY < closestYDistance && distanceY < snapThreshold) {
          closestYDistance = distanceY;
          closestY = targetBoxCenter.y;
        }

        // boundingBox 외곽라인 snap
        const distanceEdgeMinX = Math.abs(
          targetBox.min.x - (xPos + boxSize.x / 2)
        );
        if (
          distanceEdgeMinX < closestXDistance &&
          distanceEdgeMinX < snapThreshold
        ) {
          closestXDistance = distanceEdgeMinX;
          closestX = targetBox.min.x - boxSize.x / 2;
        }

        const distanceEdgeMaxX = Math.abs(
          targetBox.max.x - (xPos - boxSize.x / 2)
        );
        if (
          distanceEdgeMaxX < closestXDistance &&
          distanceEdgeMaxX < snapThreshold
        ) {
          closestXDistance = distanceEdgeMaxX;
          closestX = targetBox.max.x + boxSize.x / 2;
        }

        const distanceEdgeMinY = Math.abs(
          targetBox.min.y - (yPos + boxSize.y / 2)
        );
        if (
          distanceEdgeMinY < closestYDistance &&
          distanceEdgeMinY < snapThreshold
        ) {
          closestXDistance = distanceEdgeMinY;
          closestY = targetBox.min.y - boxSize.y / 2;
        }

        const distanceEdgeMaxY = Math.abs(
          targetBox.max.y - (yPos - boxSize.y / 2)
        );
        if (
          distanceEdgeMaxY < closestYDistance &&
          distanceEdgeMaxY < snapThreshold
        ) {
          closestYDistance = distanceEdgeMaxY;
          closestY = targetBox.max.y + boxSize.y / 2;
        }
      });

      const newX = closestX !== null ? closestX : xPos;
      const newY = closestY !== null ? closestY : yPos;

      cloneMeshRef.current!.position.set(newX, newY, 0);
    },
    onDragEnd: () => {
      if (meshRef.current && cloneMeshRef.current) {
        meshRef.current.position.copy(cloneMeshRef.current.position);
        setIsDragging(false);
      }
    },
  });

  return (
    <>
      <mesh ref={meshRef} name={id} position={startPosition}>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {isDragging && (
        <mesh
          ref={cloneMeshRef}
          name={id + "Clone"}
          position={meshRef.current!.position}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial wireframe={true} />
        </mesh>
      )}
      <primitive object={meshRef.current ?? {}} {...bind()} />
    </>
  );
}

export default Object;
