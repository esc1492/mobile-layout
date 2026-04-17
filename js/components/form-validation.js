/*
 * 폼 검증 모듈
 * Design Ref: §2.1 — Component Diagram (FormValidator 클래스)
 * Plan SC: FR-01~FR-07 (폼 검증 기능 구현)
 * 목적: 연락처 폼의 클라이언트 측 검증 로직 제공
 */

// Design Ref: §3.2 — Validation Rules
// 검증 규칙 상수 정의
const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REQUIRED: true
  },
  EMAIL: {
    MAX_LENGTH: 100,
    REQUIRED: true,
    // 간단한 이메일 형식 검증 정규식
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  MESSAGE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
    REQUIRED: true
  }
};

// Design Ref: §6.1 — Error Code Definition
// Design Ref: §3.2 — Validation Rules (Error Messages)
// 오류 메시지 상수 정의
const ERROR_MESSAGES = {
  NAME_REQUIRED: '이름을 입력해주세요 (2-50자)',
  NAME_LENGTH: '이름을 입력해주세요 (2-50자)',
  EMAIL_REQUIRED: '유효한 이메일 주소를 입력해주세요',
  EMAIL_INVALID: '유효한 이메일 주소를 입력해주세요',
  EMAIL_LENGTH: '유효한 이메일 주소를 입력해주세요',
  MESSAGE_REQUIRED: '메시지를 입력해주세요 (10-1000자)',
  MESSAGE_LENGTH: '메시지를 입력해주세요 (10-1000자)'
};

/**
 * FormValidator 클래스
 * Design Ref: §2.1 — FormValidator 클래스 구조
 */
class FormValidator {
  /**
   * 생성자
   * @param {string} formId - 검증할 폼의 ID
   */
  constructor(formId) {
    // Design Ref: §2.1 — FormValidator 클래스
    this.form = document.getElementById(formId);
    if (!this.form) {
      console.error(`Form with id "${formId}" not found`);
      return;
    }

    // 폼 필드 참조
    this.fields = {
      name: this.form.querySelector('[name="name"]'),
      email: this.form.querySelector('[name="email"]'),
      message: this.form.querySelector('[name="message"]')
    };

    // 오류 메시지 컨테이너 참조
    this.errorContainers = {
      name: document.getElementById('name-error'),
      email: document.getElementById('email-error'),
      message: document.getElementById('message-error')
    };

    // 초기화
    this._init();
  }

  /**
   * 초기화 메서드
   * Design Ref: §2.2 — Data Flow (실시간 검증 설정)
   */
  _init() {
    // 실시간 검증 이벤트 리스너 설정
    // Plan SC: FR-04 — 실시간 검증
    this.fields.name.addEventListener('input', () => this.validateName());
    this.fields.email.addEventListener('input', () => this.validateEmail());
    this.fields.message.addEventListener('input', () => this.validateMessage());

    // 폼 제출 이벤트 리스너 설정
    // Plan SC: FR-05 — 폼 제출 시 최종 검증
    this.form.addEventListener('submit', (event) => this._handleSubmit(event));
  }

  /**
   * 이름 필드 검증
   * Design Ref: §3.2 — Validation Rules (name)
   * @returns {boolean} 검증 결과
   */
  validateName() {
    const value = this.fields.name.value.trim();
    let isValid = true;
    let errorMessage = null;

    // 필수 입력 검증
    if (VALIDATION_RULES.NAME.REQUIRED && !value) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.NAME_REQUIRED;
    }
    // 길이 검증
    else if (value.length < VALIDATION_RULES.NAME.MIN_LENGTH ||
             value.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.NAME_LENGTH;
    }

    // 오류 표시/숨김
    this._updateFieldValidation('name', isValid, errorMessage);
    return isValid;
  }

  /**
   * 이메일 필드 검증
   * Design Ref: §3.2 — Validation Rules (email)
   * @returns {boolean} 검증 결과
   */
  validateEmail() {
    const value = this.fields.email.value.trim();
    let isValid = true;
    let errorMessage = null;

    // 필수 입력 검증
    if (VALIDATION_RULES.EMAIL.REQUIRED && !value) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    // 길이 검증
    else if (value.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.EMAIL_LENGTH;
    }
    // 형식 검증
    else if (value && !VALIDATION_RULES.EMAIL.PATTERN.test(value)) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.EMAIL_INVALID;
    }

    // 오류 표시/숨김
    this._updateFieldValidation('email', isValid, errorMessage);
    return isValid;
  }

  /**
   * 메시지 필드 검증
   * Design Ref: §3.2 — Validation Rules (message)
   * @returns {boolean} 검증 결과
   */
  validateMessage() {
    const value = this.fields.message.value.trim();
    let isValid = true;
    let errorMessage = null;

    // 필수 입력 검증
    if (VALIDATION_RULES.MESSAGE.REQUIRED && !value) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.MESSAGE_REQUIRED;
    }
    // 길이 검증
    else if (value.length < VALIDATION_RULES.MESSAGE.MIN_LENGTH ||
             value.length > VALIDATION_RULES.MESSAGE.MAX_LENGTH) {
      isValid = false;
      errorMessage = ERROR_MESSAGES.MESSAGE_LENGTH;
    }

    // 오류 표시/숨김
    this._updateFieldValidation('message', isValid, errorMessage);
    return isValid;
  }

  /**
   * 모든 필드 검증
   * Design Ref: §2.2 — Data Flow (최종 검증)
   * @returns {boolean} 전체 검증 결과
   */
  validateAll() {
    const nameValid = this.validateName();
    const emailValid = this.validateEmail();
    const messageValid = this.validateMessage();

    return nameValid && emailValid && messageValid;
  }

  /**
   * 필드 검증 상태 업데이트
   * Design Ref: §6.2 — Error Display Pattern
   * @param {string} fieldName - 필드 이름
   * @param {boolean} isValid - 검증 결과
   * @param {string|null} errorMessage - 오류 메시지 (없으면 null)
   */
  _updateFieldValidation(fieldName, isValid, errorMessage) {
    const field = this.fields[fieldName];
    const errorContainer = this.errorContainers[fieldName];

    if (!field || !errorContainer) return;

    // ARIA 속성 업데이트
    // Plan SC: FR-07 — 접근성 지원
    field.setAttribute('aria-invalid', !isValid);

    if (!isValid) {
      // 오류 상태
      field.classList.add('invalid');
      errorContainer.textContent = errorMessage;
      errorContainer.classList.add('visible');
    } else {
      // 유효 상태
      field.classList.remove('invalid');
      errorContainer.textContent = '';
      errorContainer.classList.remove('visible');
    }
  }

  /**
   * 폼 제출 처리
   * Design Ref: §2.2 — Data Flow (폼 제출 시 최종 검증)
   * @param {Event} event - 제출 이벤트
   */
  _handleSubmit(event) {
    // Plan SC: FR-05 — 폼 제출 시 최종 검증
    const isValid = this.validateAll();

    if (!isValid) {
      // 검증 실패 시 제출 방지
      event.preventDefault();

      // 첫 번째 오류 필드로 포커스 이동 (접근성 개선)
      // Plan SC: FR-07 — 접근성 지원
      const firstInvalidField = this._findFirstInvalidField();
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
    }
    // 검증 성공 시 기본 제출 동작 수행
    // 향후 AJAX 제출로 확장 가능 (Design Ref: §4.2)
  }

  /**
   * 첫 번째 유효하지 않은 필드 찾기
   * @returns {HTMLElement|null} 첫 번째 유효하지 않은 필드 또는 null
   */
  _findFirstInvalidField() {
    if (!this.validateName()) return this.fields.name;
    if (!this.validateEmail()) return this.fields.email;
    if (!this.validateMessage()) return this.fields.message;
    return null;
  }

  /**
   * 폼 데이터 가져오기
   * Design Ref: §3.1 — Form Data Interface
   * @returns {object} 폼 데이터 객체
   */
  getFormData() {
    return {
      name: this.fields.name.value.trim(),
      email: this.fields.email.value.trim(),
      message: this.fields.message.value.trim()
    };
  }

  /**
   * 폼 리셋 (오류 상태 초기화)
   */
  resetForm() {
    // 필드 값 초기화
    this.fields.name.value = '';
    this.fields.email.value = '';
    this.fields.message.value = '';

    // 오류 상태 초기화
    this._updateFieldValidation('name', true, null);
    this._updateFieldValidation('email', true, null);
    this._updateFieldValidation('message', true, null);
  }
}

// 전역으로 내보내기 (Node.js 환경이 아닌 브라우저에서 사용)
// @ts-ignore - 브라우저 전역에 FormValidator 클래스 노출
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
} else if (typeof window !== 'undefined') {
  // 브라우저 환경에서 전역으로 노출
  window.FormValidator = FormValidator;
}