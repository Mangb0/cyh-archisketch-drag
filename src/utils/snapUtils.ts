import * as THREE from "three";

export const snapToCenter = (
  targetBox: THREE.Box3,
  snapThreshold: number,
  currentPos: { x: number; y: number }
) => {
  const targetBoxCenter = targetBox.getCenter(new THREE.Vector3());
  const xDistance = Math.abs(targetBoxCenter.x - currentPos.x);
  const yDistance = Math.abs(targetBoxCenter.y - currentPos.y);

  let newX = null;
  let newY = null;
  const distance = { x: xDistance, y: yDistance };

  if (xDistance < snapThreshold) {
    newX = targetBoxCenter.x;
  }

  if (yDistance < snapThreshold) {
    newY = targetBoxCenter.y;
  }

  return { x: newX, y: newY, distance };
};

export const snapToOutline = (
  currentBox: THREE.Box3,
  targetBox: THREE.Box3,
  snapThreshold: number,
  currentPos: { x: number; y: number }
) => {
  const currentBoxSize = currentBox.getSize(new THREE.Vector3());

  let newX = null;
  let newY = null;

  const outlineLeft = Math.abs(
    targetBox.min.x - (currentPos.x + currentBoxSize.x / 2)
  );
  const outlineRight = Math.abs(
    targetBox.max.x - (currentPos.x - currentBoxSize.x / 2)
  );
  const outlineTop = Math.abs(
    targetBox.max.y - (currentPos.y - currentBoxSize.y / 2)
  );
  const outlineBottom = Math.abs(
    targetBox.min.y - (currentPos.y + currentBoxSize.y / 2)
  );

  const distance = {
    x: Math.min(outlineLeft, outlineRight),
    y: Math.min(outlineTop, outlineBottom),
  };

  if (outlineLeft < snapThreshold) {
    newX = targetBox.min.x - currentBoxSize.x / 2;
  } else if (outlineRight < snapThreshold) {
    newX = targetBox.max.x + currentBoxSize.x / 2;
  }

  if (outlineTop < snapThreshold) {
    newY = targetBox.max.y + currentBoxSize.y / 2;
  } else if (outlineBottom < snapThreshold) {
    newY = targetBox.min.y - currentBoxSize.y / 2;
  }

  return { x: newX, y: newY, distance };
};
