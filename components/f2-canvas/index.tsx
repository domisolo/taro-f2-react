import { ReactNode, useEffect, useRef } from 'react';
import { createSelectorQuery, getSystemInfoSync } from '@tarojs/taro';
import { ITouchEvent, CanvasTouchEvent, Canvas } from '@tarojs/components';
import { Canvas as FFCanvas } from '@antv/f2';

interface F2CanvasProps {
  id?: string;
  children?: ReactNode;
}

type CanvasEvent = ITouchEvent | CanvasTouchEvent;

interface CanvasElement {
  dispatchEvent: (type: string, event: CanvasEvent) => void;
}

function wrapEvent(e: CanvasEvent) {
  if (e && !e.preventDefault) {
    e.preventDefault = function () {};
  }
  return e;
}

const F2Canvas = (props: F2CanvasProps) => {
  const { id, children } = props;

  const idRef = useRef(id || 'f2Canvas');
  const canvasRef = useRef<typeof Canvas>();
  const ffCanvasRef = useRef<FFCanvas>();
  const canvasElRef = useRef<CanvasElement>();
  const childrenRef = useRef<ReactNode>();

  useEffect(() => {
    childrenRef.current = children;
    ffCanvasRef.current?.update({ children });
  }, [children]);

  useEffect(() => {
    return () => ffCanvasRef.current?.destroy();
  }, []);

  const renderCanvas = () => {
    const query = createSelectorQuery();
    query
      .select(`#${idRef.current}`)
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const { node, width, height } = res[0];
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
          children: childrenRef.current,
          createImage: () => node.createImage(), // fix: 解决图片元素不渲染的问题
        });
        canvas.render();
        ffCanvasRef.current = canvas;
        canvasElRef.current = canvas.canvas.get('el');
      });
  };

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(renderCanvas);
    }
  }, [canvasRef]);

  const handleClick = (e: ITouchEvent) => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) {
      return;
    }

    const event = wrapEvent(e);
    // 包装成 touch 对象
    event.touches = [e.detail];
    canvasEl.dispatchEvent('click', event);
  };

  const handleTouchStart = (e: CanvasTouchEvent) => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) {
      return;
    }
    canvasEl.dispatchEvent('touchstart', wrapEvent(e));
  };

  const handleTouchMove = (e: CanvasTouchEvent) => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) {
      return;
    }
    canvasEl.dispatchEvent('touchmove', wrapEvent(e));
  };

  const handleTouchEnd = (e: CanvasTouchEvent) => {
    const canvasEl = canvasElRef.current;
    if (!canvasEl) {
      return;
    }
    canvasEl.dispatchEvent('touchend', wrapEvent(e));
  };

  return (
    <Canvas
      id={idRef.current}
      ref={canvasRef}
      type="2d"
      style="width:100%;height:100%;display:block;padding: 0;margin: 0;"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default F2Canvas;
