/*
 * 네비게이션 컴포넌트 JavaScript
 * Design Ref: §6.3 — 모바일 네비게이션 (햄버거 메뉴 토글 기능)
 * 목적: 반응형 햄버거 메뉴 토글, 접근성 향상, 키보드 네비게이션
 */

// Design Ref: §6.3 — JavaScript 토글 기능
// Plan SC: FR-02 (햄버거 메뉴를 통한 모바일 네비게이션 구현)

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 요소 선택
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const navOverlay = document.querySelector('.nav-overlay');

  // 요소가 존재하는지 확인
  if (!menuToggle || !navList) {
    console.warn('네비게이션 요소를 찾을 수 없습니다. HTML 구조를 확인하세요.');
    return;
  }

  // 오버레이 요소가 없으면 생성
  if (!navOverlay) {
    createNavOverlay();
  }

  const overlay = document.querySelector('.nav-overlay');

  // 메뉴 토글 함수
  function toggleMenu() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    // ARIA 속성 업데이트
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navList.setAttribute('aria-hidden', isExpanded);

    // 클래스 토글
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
    overlay.classList.toggle('active');

    // 모바일에서 메뉴 열릴 때 body 스크롤 방지
    if (window.innerWidth <= 767) {
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    }

    // 포커스 트랩: 메뉴가 열리면 첫 번째 링크로 포커스 이동
    if (!isExpanded) {
      const firstNavLink = navList.querySelector('a');
      if (firstNavLink) {
        firstNavLink.focus();
      }
    }
  }

  // 메뉴 닫기 함수
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navList.setAttribute('aria-hidden', 'true');
    menuToggle.classList.remove('active');
    navList.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // 오버레이 생성 함수
  function createNavOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('tabindex', '-1');
    document.body.appendChild(overlay);

    // 오버레이 클릭 시 메뉴 닫기
    overlay.addEventListener('click', closeMenu);
  }

  // 햄버거 메뉴 버튼 클릭 이벤트
  menuToggle.addEventListener('click', function(event) {
    event.stopPropagation(); // 이벤트 버블링 방지
    toggleMenu();
  });

  // 오버레이 이벤트 리스너 (이미 생성되었다면)
  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // ESC 키로 메뉴 닫기
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && navList.classList.contains('active')) {
      closeMenu();
      menuToggle.focus(); // 포커스를 버튼으로 돌려줌
    }
  });

  // 모바일에서 화면 크기 변경 시 메뉴 상태 조정
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // 태블릿/데스크톱 크기에서 메뉴 자동 닫기
      if (window.innerWidth >= 768 && navList.classList.contains('active')) {
        closeMenu();
      }
    }, 250); // 디바운싱
  });

  // 네비게이션 링크 클릭 시 모바일에서 메뉴 닫기
  const navLinks = navList.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 767) {
        closeMenu();
      }
    });
  });

  // 키보드 네비게이션 지원
  navList.addEventListener('keydown', function(event) {
    const links = Array.from(navList.querySelectorAll('a'));
    const currentIndex = links.indexOf(document.activeElement);

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        links[nextIndex].focus();
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + links.length) % links.length;
        links[prevIndex].focus();
        break;

      case 'Home':
        event.preventDefault();
        links[0].focus();
        break;

      case 'End':
        event.preventDefault();
        links[links.length - 1].focus();
        break;
    }
  });

  // 초기 ARIA 속성 설정
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-controls', 'nav-list');
  menuToggle.setAttribute('aria-label', '메뉴 토글');
  navList.setAttribute('aria-hidden', 'true');
  navList.setAttribute('aria-label', '주요 네비게이션');
  navList.id = 'nav-list';

  // 네비게이션 JavaScript 로드 완료 (디버깅 로그 제거됨 - CLAUDE.md 준수)
});

// Design Ref: §5.2 — Accessibility Features (키보드 내비게이션, 스크린 리더)
// Plan SC: Non-Functional Requirements — Accessibility (WCAG 2.1 AA 준수)