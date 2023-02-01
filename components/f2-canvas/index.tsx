import { ReactNode, FC, useEffect, useRef } from 'react';
import { useReady, createSelectorQuery, getSystemInfoSync } from '@tarojs/taro';
import { ITouchEvent, CanvasTouchEvent, Canvas } from '@tarojs/components';
import { Canvas as FFCanvas } from '@antv/f2';

import useUnmount from './use-unmount';

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

const F2Canvas: FC<F2CanvasProps> = (props) => {
  const { id, children } = props;

  const idRef = useRef(id || 'f2Canvas');
  const canvasRef = useRef<FFCanvas>();
  const canvasElRef = useRef<CanvasElement>();
  const childrenRef = useRef<ReactNode>(children);

  useEffect(() => {
    childrenRef.current = children;
    canvasRef.current?.update({ children });
  }, [children]);

  useUnmount(() => {
    canvasRef.current?.destroy();
  });

  useReady(() => {
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
            createImage: () => node.createImage(),
          });
          canvas.render();
          canvasRef.current = canvas;
          canvasElRef.current = canvas.canvas.get('el');
        });
    };

    // 延迟是为了确保能获取到 node 对象，直接获取会出现 node 为 null 的情况
    // 如有更好的办法欢迎提 PR 或 issue: https://github.com/daniel-zd/taro-f2-react/issues
    setTimeout(renderCanvas);
  });

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
