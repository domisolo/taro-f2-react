import { ReactNode, useCallback, useEffect, useRef } from 'react';
import {
  createOffscreenCanvas,
  createSelectorQuery,
  getSystemInfoSync,
} from '@tarojs/taro';
import { Canvas } from '@tarojs/components';
import { Canvas as FFCanvas } from '@antv/f2';

interface F2CanvasProps {
  id?: string;
  children?: ReactNode;
}

function convertTouches(touches) {
  if (!touches) return touches;
  touches.forEach((touch) => {
    touch.pageX = 0;
    touch.pageY = 0;
    touch.clientX = touch.x;
    touch.clientY = touch.y;
  });
  return touches;
}

function dispatchEvent(el, event, type) {
  if (!el || !event) return;
  if (!event.preventDefault) {
    event.preventDefault = function () {};
  }
  const mergedEvent = {
    ...event,
    type,
    target: el,
  };
  const { touches, changedTouches, detail } = mergedEvent;
  mergedEvent.touches = convertTouches(touches);
  mergedEvent.changedTouches = convertTouches(changedTouches);
  if (detail) {
    mergedEvent.clientX = detail.x;
    mergedEvent.clientY = detail.y;
  }
  el.dispatchEvent(mergedEvent);
}

const F2Canvas = (props: F2CanvasProps) => {
  const { id, children } = props;

  const idRef = useRef(id || 'f-canvas');
  const canvasRef = useRef<typeof Canvas>();
  const ffCanvasRef = useRef<FFCanvas>();
  const canvasElRef = useRef<any>();
  // const childrenRef = useRef<ReactNode>();

  const renderCanvas = useCallback(() => {
    const query = createSelectorQuery();
    query
      .select(`#${idRef.current}`)
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const { node, width, height } = res[0];
        const { requestAnimationFrame, cancelAnimationFrame } = node;

        const pixelRatio = getSystemInfoSync().pixelRatio;
        // 高清设置
        node.width = width * pixelRatio;
        node.height = height * pixelRatio;
        const context = node.getContext('2d');
        const canvas = new FFCanvas({
          pixelRatio,
          width,
          height,
          context,
          children,
          // @ts-ignore
          offscreenCanvas: createOffscreenCanvas({ type: '2d' }),
          createImage: () => node.createImage(), // fix: 解决图片元素不渲染的问题
          requestAnimationFrame,
          cancelAnimationFrame,
          isTouchEvent: (e) => e.type.startsWith('touch'),
          isMouseEvent: (e) => e.type.startsWith('mouse'),
        });
        ffCanvasRef.current = canvas;
        canvasElRef.current = canvas.getCanvasEl();
        canvas.render();
      });
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(renderCanvas);
    }
  }, [canvasRef]);

  useEffect(() => {
    ffCanvasRef.current?.update({ children });
  }, [children]);

  useEffect(() => {
    return () => ffCanvasRef.current?.destroy();
  }, []);

  return (
    <Canvas
      id={idRef.current}
      ref={canvasRef}
      type="2d"
      style="width:100%;height:100%;display:block;padding: 0;margin: 0;"
      onClick={(e) => dispatchEvent(canvasElRef.current, e, 'click')}
      onTouchStart={(e) => dispatchEvent(canvasElRef.current, e, 'touchstart')}
      onTouchMove={(e) => dispatchEvent(canvasElRef.current, e, 'touchmove')}
      onTouchEnd={(e) => dispatchEvent(canvasElRef.current, e, 'touchend')}
    />
  );
};

export default F2Canvas;
