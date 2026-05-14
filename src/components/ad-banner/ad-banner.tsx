import { MouseEvent, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./ad-banner.css";

export const AdBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <>
      <div className="navigation-wrapper rounded-xl overflow-hidden mt-4">
        <div ref={sliderRef} className="keen-slider">
          <div className="keen-slider__slide number-slide1">
            <img src="https://images.uzum.uz/crdd3ae0t1lqb8aqevt0/main_page_banner.jpg" />
          </div>
          <div className="keen-slider__slide number-slide2">
            <img src="https://images.uzum.uz/crdd3ae0t1lqb8aqevt0/main_page_banner.jpg" />
          </div>
          <div className="keen-slider__slide number-slide3">
            <img src="https://images.uzum.uz/crdd3ae0t1lqb8aqevt0/main_page_banner.jpg" />
          </div>
          <div className="keen-slider__slide number-slide4">
            <img src="https://images.uzum.uz/crdd3ae0t1lqb8aqevt0/main_page_banner.jpg" />
          </div>
          <div className="keen-slider__slide number-slide5">
            <img src="https://images.uzum.uz/crdd3ae0t1lqb8aqevt0/main_page_banner.jpg" />
          </div>
        </div>
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - 1
              }
            />
          </>
        )}
        {loaded && instanceRef.current && (
          <div className="dots">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={"dot" + (currentSlide === idx ? " active" : "")}
                ></button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: MouseEvent<SVGSVGElement>) => void;
}) {
  const disabled = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={`arrow ${
        props.left ? "arrow--left" : "arrow--right"
      } ${disabled}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
