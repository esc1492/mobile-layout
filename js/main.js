/*
 * 메인 JavaScript 파일
 * Design Ref: §6.4 — 성능 최적화 (모듈-4)
 * 목적: 공통 JavaScript 기능, 성능 최적화
 */

// Design Ref: §6.4 — 성능 최적화
// Plan SC: Non-Functional Requirements — Performance (Lighthouse 성능 점수 90+)

// 모든 JavaScript 코드는 DOM이 준비된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 메인 JavaScript 로드 완료 (디버깅 로그 제거됨 - CLAUDE.md 준수)

  // 향후 기능 추가를 위한 플레이스홀더
  // 이미지 지연 로딩, 폼 검증 등 모듈-4에서 구현

  // Design Ref: §2.1 — Main Entry (FormValidator 인스턴스 생성)
  // Plan SC: FR-05 — 폼 제출 시 최종 검증, FR-07 — 접근성 지원
  initializeFormValidation();
});

/**
 * FormValidator 클래스 타입 정의 (JSDoc)
 * @typedef {Object} FormValidator
 * @property {function(): boolean} validateName - 이름 필드 검증
 * @property {function(): boolean} validateEmail - 이메일 필드 검증
 * @property {function(): boolean} validateMessage - 메시지 필드 검증
 * @property {function(): boolean} validateAll - 모든 필드 검증
 * @property {function(): Object} getFormData - 폼 데이터 가져오기
 * @property {function()} resetForm - 폼 리셋
 */

/**
 * 폼 검증 초기화 함수
 * Design Ref: §2.1 — Component Diagram (main.js 통합)
 */
function initializeFormValidation() {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    // FormValidator 인스턴스 생성
    // Note: FormValidator 클래스는 form-validation.js에서 정의됨
    try {
      // @ts-ignore - FormValidator는 form-validation.js에서 전역으로 노출됨
      if (typeof FormValidator !== 'undefined') {
        /** @type {FormValidator} */
        const _formValidator = new FormValidator('contact-form');
        // FormValidator 초기화 성공 (디버깅 로그 제거됨)
      } else {
        console.warn('FormValidator class not found. Ensure form-validation.js is loaded.');
      }
    } catch (error) {
      console.error('Error initializing FormValidator:', error);
      // 점진적 향상: JavaScript 실패 시 기본 폼 동작 유지
    }
  }
  // contact-form이 없는 페이지에서는 초기화 생략
}