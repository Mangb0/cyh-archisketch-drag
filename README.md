# cyh-archisketch-drag

**아키스케치 프론트엔드 3D 과제**

웹 3D application 구현

3D 공간상의 Mesh 드래그 이동

---

## 기능

### Scene 구성

- **직교 카메라**: `@react-drei/drei`의 `OrthographicCamera` 컴포넌트를 사용하여 기본값인 Perspective Camera에서 Orthographic Camera로 변경해주었습니다.

- **다각형 도형 생성**: `circleGeometry`를 활용하여 radius와 sides 값으로 다양한 도형 모양을 생성합니다. 도형의 mesh가 생성될 때, `useEffect`훅으로 `geometry.center()`를 통해 pivot이 mesh의 geometry 중앙으로 적용되도록 조정하였습니다.

### 드래그 이동 기능

- **이벤트 감지**: `react-use-gesture` 라이브러리의 `useGesture` 훅을 사용하여 `onDragStart`, `onDrag`, `onDragEnd` 이벤트를 감지해 드래그 동작들을 관리하였습니다.

- **드래그 상태 관리**: 드래그가 시작 시, `onDragStart`에서 `isDragging` 상태를 `true`로 설정합니다.

- **이동 효과 Mesh 구현**: 사용자가 Mesh 이동을 명확히 인지할 수 있도록 cloneMesh를 생성하였습니다. `isDragging` 값을 통해 이동 모드 상태를 감지했을 때 클릭했던 mesh의 geometry와 같은 cloneMesh를 랜더링합니다. 원본 Mesh와 구분을 위해 Material에 wireframe 속성을 주었습니다.

- **드래그 이동**: `onDrag` 이벤트를 통해 드래그 동작에 따라 계산된 x,y 값을 사용하여 도형의 위치를 업데이트합니다. 이때 `@react-three/fiber` 라이브러리의 `useThree`을 통해 얻은 canvas 크기와 viewport 정보를 활용하여 3D 공간에서의 이동이 화면 비율에 맞게 조정됩니다.

- **이동 중 스냅**: 이동 중 각 scene의 Mesh들의 `Three`의 `Box3` 바운딩박스를 통해 스 조건을 검사하고, 조건을 만족하는 경우 스냅 위치로 자동으로 이동시킵니다.
- **드래그 종료 처리**: 드래그가 종료되면 `onDragEnd` 이벤트에서 `isDragging` 상태를 `false`로 설정하고 cloneMesh의 최종 위치에 원본 Mesh를 해당 위치로 이동시킵니다.

### 스냅 기능

- **스냅 적용 거리**: 이동 중인 Mesh와 배치된 다른 Mesh들 간의 거리를 계산하여, 거리가 `snapThreshold`보다 작을 경우 자동으로 스냅이 되도록 구현하였습니다.

- **최단 거리 우선 적용**: 여러 가능한 스냅 위치 중에서 가장 가까운 거리를 선택하는 로직을 구현하였습니다.

- **중앙 스냅**: `Box3`의 `getCenter` 메서드를 활용하여 다른 Mesh들의 중심 좌표를 찾아 고정되게 구현하였습니다.

- **외곽라인 스냅**: 각 Mesh의 `Box3` 객체에서 제공하는 min, max 좌표를 사용하여 바운딩박스의 외곽라인 스냅 좌표를 설정합니다. 이동 중인 Mesh의 바운딩박스 모서리가 다른 Mesh의 외곽선에 도달하면 해당 위치에 정렬이 되도록 구현하였습니다.

- **모서리 스냅**: 외곽라인 스냅과 같이 바운딩 박스의 모서리를 이용한 스냅 기능입니다. 이동 중인 Mesh의 모서리가 다른 Mesh의 모서리 축과 정렬이 되도록 구현하였습니다.

---

## 개발환경 실행

설치

```
npm install
```

실행

```
npm run dev
```
