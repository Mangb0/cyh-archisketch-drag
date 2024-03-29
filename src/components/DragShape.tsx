import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useGesture } from "react-use-gesture";
import * as THREE from "three";
import { snapToCenter, snapToEdge, snapToOutline } from "../utils/snapUtils";

interface Props {
  sides: number;
  radius: number;
  id: string;
  startPosition: [number, number];
}

function DragShape({ sides, radius, id, startPosition }: Props) {
  // Mesh ref 생성
  const meshRef = useRef<THREE.Mesh>(null);
  // clone Mesh ref 생성
  const cloneMeshRef = useRef<THREE.Mesh>(null);

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);

  // canvas, viewport 크기 및 scene 정보
  const { size, viewport, scene } = useThree();

  // 화면 비율 계산
  const aspect = size.width / viewport.width;

  // snap 적용 거리
  const snapThreshold = 0.2;

  // Mesh geometry 조정
  useEffect(() => {
    meshRef.current?.geometry.center();
  }, [meshRef.current?.isMesh]);

  // 드래그 이벤트
  const bind = useGesture({
    onDragStart: (event) => {
      // 다중 Mesh 선택 방지
      event.event.stopPropagation();
      setIsDragging(true);
    },
    onDrag: ({ offset: [x, y] }) => {
      // 드래그 중인 Mesh의 x, y 좌표 계산
      const xPos = startPosition[0] + x / aspect;
      const yPos = startPosition[1] + -y / aspect;
      const currentPos = { x: xPos, y: yPos };

      // 가장 가까운 snap 좌표 및 거리
      let closestXDistance = Infinity;
      let closestX = xPos;
      let closestYDistance = Infinity;
      let closestY = yPos;

      const currentBox = new THREE.Box3().setFromObject(cloneMeshRef.current!);

      scene.children.forEach((child) => {
        if (!(child instanceof THREE.Mesh) || child.name.includes(id)) return;
        const targetBox = new THREE.Box3().setFromObject(child);

        // boundingBox 중앙 snap
        const center = snapToCenter(targetBox, snapThreshold, currentPos);

        if (center.x !== null && center.distance.x < closestXDistance) {
          closestXDistance = center.distance.x;
          closestX = center.x;
        }

        if (center.y !== null && center.distance.y < closestYDistance) {
          closestYDistance = center.distance.y;
          closestY = center.y;
        }

        // boundingBox 외곽라인 snap
        const outline = snapToOutline(
          currentBox,
          targetBox,
          snapThreshold,
          currentPos
        );

        if (outline.x !== null && outline.distance.x < closestXDistance) {
          closestXDistance = outline.distance.x;
          closestX = outline.x;
        }

        if (outline.y !== null && outline.distance.y < closestYDistance) {
          closestYDistance = outline.distance.y;
          closestY = outline.y;
        }

        // boundingBox 모서리 snap
        const edge = snapToEdge(
          currentBox,
          targetBox,
          snapThreshold,
          currentPos
        );

        if (edge.x !== null && edge.distance.x < closestXDistance) {
          closestXDistance = edge.distance.x;
          closestX = edge.x;
        }

        if (edge.y !== null && edge.distance.y < closestYDistance) {
          closestYDistance = edge.distance.y;
          closestY = edge.y;
        }
      });

      const newX = closestX;
      const newY = closestY;

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
      <mesh ref={meshRef} name={id} position={[...startPosition, 0]}>
        <circleGeometry args={[radius, sides]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {isDragging && (
        <mesh
          ref={cloneMeshRef}
          name={`${id}Clone`}
          position={meshRef.current!.position}
          geometry={meshRef.current?.geometry}
        >
          {/* <circleGeometry args={[radius, sides]} /> */}
          <meshBasicMaterial wireframe={true} />
        </mesh>
      )}
      <primitive object={meshRef.current ?? {}} {...bind()} />
    </>
  );
}

export default DragShape;
