import { useRef, useState, useEffect } from 'react';
import * as React from 'react';
import PLACE_HOLDER from '../../assets/images/landing_icon/introduction_taal.svg';
import { CardMedia } from '@mui/material';

interface IProps {
  src: string;
  alt: string;
  style?: object;
  height?: string;
}

function ImageViewer({ src, alt, style, height }: IProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoad, setIsLoad] = useState(false);

  useEffect(() => {
    function loadImage() {
      setIsLoad(true);
    }

    const imgEl = imgRef.current;
    imgEl && imgEl.addEventListener(LOAD_IMG_EVENT_TYPE, loadImage);
    return () => {
      imgEl && imgEl.removeEventListener(LOAD_IMG_EVENT_TYPE, loadImage);
    };
  }, []);

  useEffect(() => {
    if (!observer) {
      observer = new IntersectionObserver(onIntersection, {
        threshold: 0.5,
      });
    }
    imgRef.current && observer.observe(imgRef.current);
  }, []);
  return (
    <CardMedia
      ref={imgRef}
      component={'img'}
      src={isLoad ? src : PLACE_HOLDER}
      alt={alt}
      style={style}
      height={height}
    />
  );
}

let observer: IntersectionObserver | null = null;
const LOAD_IMG_EVENT_TYPE = 'loadImage';

function onIntersection(entries: IntersectionObserverEntry[], io: IntersectionObserver) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      io.unobserve(entry.target);
      entry.target.dispatchEvent(new CustomEvent(LOAD_IMG_EVENT_TYPE));
    }
  });
}

export default ImageViewer;
