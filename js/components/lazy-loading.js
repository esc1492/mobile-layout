/*
 * 이미지 지연 로딩 컴포넌트
 * Design Ref: §6.4 — 성능 최적화 (이미지 지연 로딩 구현)
 * 목적: 초기 페이지 로딩 속도 향상, 대역폭 절약
 */

// Design Ref: §6.4 — 이미지 지연 로딩 구현
// Plan SC: FR-04 (이미지 반응형 처리), Non-Functional Requirements — Performance

class LazyLoader {
  constructor() {
    this.observer = null;
    this.config = {
      rootMargin: '50px 0px',
      threshold: 0.01
    };
    this.init();
  }

  init() {
    // Intersection Observer 지원 확인
    if (!('IntersectionObserver' in window)) {
      this.fallbackLazyLoad();
      return;
    }

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.config);
    this.registerImages();
  }

  registerImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');

    lazyImages.forEach(img => {
      // 이미지에 loading="lazy" 속성이 있고 네이티브 로딩을 지원하면 Observer 사용 안 함
      if (img.loading === 'lazy' && 'loading' in HTMLImageElement.prototype) {
        return;
      }

      this.observer.observe(img);
    });

    // 지연 로딩 등록된 이미지: ${lazyImages.length}개 (디버깅 로그 제거됨 - CLAUDE.md 준수)
  }

  handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        this.loadImage(img);
        observer.unobserve(img);
      }
    });
  }

  loadImage(img) {
    // data-src를 src로 이동
    if (img.dataset.src) {
      img.src = img.dataset.src;
      delete img.dataset.src;
    }

    // data-srcset을 srcset으로 이동
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      delete img.dataset.srcset;
    }

    // data-sizes를 sizes로 이동
    if (img.dataset.sizes) {
      img.sizes = img.dataset.sizes;
      delete img.dataset.sizes;
    }

    // 로딩 완료 이벤트
    img.addEventListener('load', () => {
      img.classList.add('lazy-loaded');
      img.removeAttribute('data-lazy');
    });

    // 오류 처리
    img.addEventListener('error', () => {
      console.error('이미지 로딩 실패:', img.dataset.src || img.src);
      img.classList.add('lazy-error');
    });
  }

  fallbackLazyLoad() {
    // Intersection Observer를 지원하지 않는 브라우저를 위한 폴백
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');

    const scrollHandler = () => {
      lazyImages.forEach(img => {
        if (this.isInViewport(img)) {
          this.loadImage(img);
        }
      });
    };

    // 스크롤 이벤트에 디바운싱 적용
    let scrollTimer;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(scrollHandler, 100);
    });

    // 초기 로딩 시 실행
    scrollHandler();
    // 폴백 지연 로딩 활성화 (Intersection Observer 미지원) (디버깅 로그 제거됨 - CLAUDE.md 준수)
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    );
  }

  // 모든 이미지 강제 로드 (필요시)
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    lazyImages.forEach(img => this.loadImage(img));
  }
}

// DOM 준비 후 지연 로딩 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
});

// Design Ref: §5.3 — Touch Interaction (성능 최적화로 터치 반응성 향상)
// Plan SC: Non-Functional Requirements — Load Time (모바일 3G에서 FCP < 1.5초)