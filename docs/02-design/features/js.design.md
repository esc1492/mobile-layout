# js (연락처 폼 검증) Design Document

> **Summary**: 연락처 폼에 대한 클라이언트 측 JavaScript 검증 기능 구현
>
> **Project**: bkit - Starter
> **Version**: 1.0.0
> **Author**: 사용자
> **Date**: 2026-04-17
> **Status**: Draft
> **Planning Doc**: [js.plan.md](../01-plan/features/js.plan.md)

### Pipeline References (if applicable)

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 | [Schema Definition](../01-plan/schema.md) | N/A |
| Phase 2 | [Coding Conventions](../01-plan/conventions.md) | N/A |
| Phase 3 | [Mockup](../02-design/mockup/js.md) | N/A |
| Phase 4 | [API Spec](../02-design/api/js.md) | N/A |

> **Note**: If Pipeline documents exist, reference them in the relevant sections below.

---

## Context Anchor

> Copied from Plan document. Ensures strategic context survives Design→Do handoff.

| Key | Value |
|-----|-------|
| **WHY** | 잘못된 폼 입력으로 인한 서버 오류와 사용자 불만 해결 |
| **WHO** | 웹사이트 방문자, 연락처 폼을 사용하는 사용자 |
| **RISK** | JavaScript 비활성화 환경에서 작동 안 함, 브라우저 호환성 문제 |
| **SUCCESS** | 모든 검증 규칙 정상 작동, Lighthouse 성능 점수 90+ 유지, WCAG 2.1 AA 준수 |
| **SCOPE** | Phase 1: 기본 검증 로직 → Phase 2: 실시간 피드백 → Phase 3: 접근성 향상 → Phase 4: 테스트 및 최적화 |

---

## Design Anchor (if Pencil MCP used)

> Locked design tokens from initial concept pages. Enforced on every new page.
> Capture with: `/design-anchor capture js`
> File: `docs/02-design/styles/js.design-anchor.md`

| Category | Tokens |
|----------|--------|
| **Colors** | primary: `{value}`, bg: `{value}`, text: `{value}` |
| **Typography** | {font-family}, sizes: {scale} |
| **Spacing** | {base-unit} grid, card: {value}, section: {value} |
| **Radius** | default: `{value}` |
| **Tone** | {design tone description} |
| **Layout** | {layout pattern description} |

> Remove this section if not using Pencil MCP for this feature.

---

## 1. Overview

### 1.1 Design Goals

1. **사용자 경험 향상**: 실시간 폼 검증으로 사용자가 즉시 오류를 확인하고 수정할 수 있도록 함
2. **접근성 보장**: 키보드 내비게이션, 스크린 리더 호환성, WCAG 2.1 AA 준수
3. **성능 유지**: Lighthouse 성능 점수 90+ 유지, JavaScript 번들 크기 최소화
4. **유지보수성**: 모듈화된 코드 구조, 명확한 주석, 문서화
5. **크로스 브라우저 호환성**: 최신 브라우저 2개 버전에서 정상 작동

### 1.2 Design Principles

- **단일 책임 원칙 (Single Responsibility Principle)**: 각 함수/모듈은 하나의 책임만 가짐
- **점진적 향상 (Progressive Enhancement)**: JavaScript 비활성화 환경에서도 기본 기능 작동
- **접근성 우선 (Accessibility First)**: 모든 사용자를 위한 디자인
- **성능 최적화 (Performance Optimization)**: 불필요한 리소스 사용 최소화
- **일관성 (Consistency)**: 기존 JavaScript 구조와 일관된 코드 스타일 유지

---

## 2. Architecture Options (v1.7.0)

### 2.0 Architecture Comparison

Three architecture options are evaluated before detailed design. User selects one via Checkpoint 3.

| Criteria | Option A: Minimal | Option B: Clean | Option C: Pragmatic |
|----------|:-:|:-:|:-:|
| **Approach** | Least change, max reuse | Best separation, most maintainable | Good boundaries, balanced |
| **New Files** | 0 (main.js 수정) | 3+ (모듈, 유틸리티, 테스트) | 2 (form-validation.js, contact.html) |
| **Modified Files** | 1 (main.js) | 1+ (main.js, 기존 구조) | 2 (main.js, index.html 링크 추가) |
| **Complexity** | Low | High | Medium |
| **Maintainability** | Medium | High | High |
| **Effort** | Low | High | Medium |
| **Risk** | Low (coupled) | Low (clean) | Low (balanced) |
| **Recommendation** | Quick wins, hotfixes | Long-term projects | **Default choice** |

**Selected**: **Option C: Pragmatic Balance** — **Rationale**: 기존 `js/components/` 구조와 일관성 유지하면서 모듈화된 검증 로직 구현. Starter 레벨 프로젝트에 적합한 균형 잡힌 접근.

> The detailed design below follows the selected architecture option.

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────┐
│              HTML (contact.html)            │
│  ┌──────────────────────────────────────┐  │
│  │  연락처 폼 (form#contact-form)        │  │
│  │  - 이름 입력 (input#name)            │  │
│  │  - 이메일 입력 (input#email)         │  │
│  │  - 메시지 입력 (textarea#message)    │  │
│  │  - 오류 메시지 컨테이너 (.error-msg) │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────┐
│      JavaScript (form-validation.js)        │
│  ┌──────────────────────────────────────┐  │
│  │  FormValidator 클래스                 │  │
│  │  - validateName()                    │  │
│  │  - validateEmail()                   │  │
│  │  - validateMessage()                 │  │
│  │  - 실시간 검증 (onInput)             │  │
│  │  - 최종 검증 (onSubmit)              │  │
│  │  - 오류 표시 (showError/hideError)   │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────┐
│         Main Entry (main.js)                │
│  ┌──────────────────────────────────────┐  │
│  │  DOMContentLoaded 이벤트 리스너       │  │
│  │  - FormValidator 인스턴스 생성        │  │
│  │  - 기존 모듈 통합 (navigation, lazy) │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 2.2 Data Flow

```
1. 사용자 입력 → 2. 실시간 검증 (onInput) → 3. 오류 표시/숨김
                     ↓
4. 폼 제출 시 → 5. 최종 검증 → 6. 모든 필드 통과 → 7. 서버 제출
                     ↓
               8. 검증 실패 → 9. 오류 표시 및 제출 방지
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| form-validation.js | DOM API, 브라우저 이벤트 | 폼 검증 로직 실행 |
| main.js | form-validation.js, navigation.js, lazy-loading.js | 애플리케이션 진입점, 모듈 통합 |
| contact.html | CSS 스타일시트, form-validation.js | 연락처 폼 UI 및 기능 |

---

## 3. Data Model

### 3.1 Form Data Interface

```typescript
// 폼 데이터 타입 정의
interface ContactFormData {
  name: string;      // 사용자 이름 (2-50자)
  email: string;     // 이메일 주소 (유효한 형식)
  message: string;   // 메시지 내용 (10-1000자)
}

// 검증 결과 타입 정의
interface ValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}
```

### 3.2 Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| **name** | 1. 필수 입력<br>2. 최소 2자<br>3. 최대 50자 | "이름을 입력해주세요 (2-50자)" |
| **email** | 1. 필수 입력<br>2. 유효한 이메일 형식<br>3. 최대 100자 | "유효한 이메일 주소를 입력해주세요" |
| **message** | 1. 필수 입력<br>2. 최소 10자<br>3. 최대 1000자 | "메시지를 입력해주세요 (10-1000자)" |

---

## 4. API Specification

> **Note**: Starter 레벨 프로젝트는 정적 사이트로, 백엔드 API가 없습니다.
> 폼 제출은 기본 HTML form action을 사용하거나, 향후 Dynamic 레벨로 업그레이드 시 BaaS(bkend.ai) 통합 고려.

### 4.1 폼 제출 처리 (현재)

```html
<!-- 기본 HTML 폼 제출 -->
<form id="contact-form" action="/submit-contact" method="POST">
  <!-- 폼 필드 -->
  <button type="submit">메시지 보내기</button>
</form>
```

### 4.2 향상된 폼 제청 (추천)

```javascript
// JavaScript로 폼 제청 제어
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // 기본 제출 방지
  
  if (validator.validateAll()) {
    // 유효성 검증 통과 시 AJAX 요청 또는 기본 제출
    const formData = new FormData(form);
    
    // 향후 BaaS 통합 시:
    // const response = await fetch('/api/contact', { method: 'POST', body: formData });
    // if (response.ok) { 성공 처리 }
    
    form.submit(); // 현재는 기본 제출
  }
});
```

---

## 5. UI/UX Design (if applicable)

### 5.1 Screen Layout - Contact Page

```
┌─────────────────────────────────────────────────────┐
│  Header (로고 + 네비게이션)                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  <h1>연락처</h1>                                    │
│  <p>문의사항을 보내주세요</p>                       │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  <form id="contact-form">                   │   │
│  │    <label for="name">이름</label>           │   │
│  │    <input id="name" name="name">            │   │
│  │    <div class="error-msg" data-for="name">  │   │
│  │      <!-- 오류 메시지 -->                    │   │
│  │    </div>                                   │   │
│  │                                             │   │
│  │    <label for="email">이메일</label>        │   │
│  │    <input id="email" name="email" type="email">│
│  │    <div class="error-msg" data-for="email"> │   │
│  │      <!-- 오류 메시지 -->                    │   │
│  │    </div>                                   │   │
│  │                                             │   │
│  │    <label for="message">메시지</label>      │   │
│  │    <textarea id="message" name="message"></textarea>
│  │    <div class="error-msg" data-for="message">│  │
│  │      <!-- 오류 메시지 -->                    │   │
│  │    </div>                                   │   │
│  │                                             │   │
│  │    <button type="submit">보내기</button>     │   │
│  │  </form>                                    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Footer (저작권 정보)                               │
└─────────────────────────────────────────────────────┘
```

### 5.2 User Flow

```
홈페이지 → 네비게이션 "연락처" 클릭 → Contact 페이지 로드
→ 폼 필드 입력 (실시간 검증) → 오류 발생 시 즉시 표시
→ 모든 필드 유효 → "보내기" 버튼 활성화 → 폼 제출
→ 성공/실패 피드백
```

### 5.3 Component List

| Component | Location | Responsibility |
|-----------|----------|----------------|
| Contact Form | `contact.html` | 연락처 폼 UI, 사용자 입력 수집 |
| FormValidator | `js/components/form-validation.js` | 폼 검증 로직, 오류 처리 |
| Error Display | `contact.html` (`.error-msg`) | 오류 메시지 표시 |

### 5.4 Page UI Checklist (v2.1.0)

> **CRITICAL**: List EVERY required UI element per page. Gap Detector verifies each item.
> Without this checklist, gap analysis only checks file existence (structural), not content (functional).

#### Contact Page

- [ ] Form: Contact form with `id="contact-form"`
- [ ] Input: Name field with `id="name"`, `name="name"`
- [ ] Input: Email field with `id="email"`, `name="email"`, `type="email"`
- [ ] Textarea: Message field with `id="message"`, `name="message"`, `rows="5"`
- [ ] Error Container: Name error with `class="error-msg"`, `data-for="name"`
- [ ] Error Container: Email error with `class="error-msg"`, `data-for="email"`
- [ ] Error Container: Message error with `class="error-msg"`, `data-for="message"`
- [ ] Button: Submit button with `type="submit"`, text "보내기"
- [ ] Label: Name label with `for="name"`, text "이름"
- [ ] Label: Email label with `for="email"`, text "이메일"
- [ ] Label: Message label with `for="message"`, text "메시지"
- [ ] Heading: Page title `<h1>` with text "연락처"
- [ ] Description: Page description `<p>` with text "문의사항을 보내주세요"
- [ ] Navigation: Link to contact page in navigation menu
- [ ] ARIA Attributes: `aria-describedby` for error messages, `aria-invalid` for invalid fields
- [ ] CSS Classes: `.error-msg` (hidden by default, shown on error), `.invalid` for invalid fields

---

## 6. Error Handling

### 6.1 Error Code Definition

| 상황 | 사용자 메시지 | 원인 | 처리 |
|------|--------------|------|------|
| 빈 필드 | "{필드명}을 입력해주세요" | 필수 입력 필드 비어있음 | 오류 표시, 제출 방지 |
| 잘못된 형식 | "유효한 {형식}을 입력해주세요" | 이메일 형식 오류 등 | 오류 표시, 제출 방지 |
| 길이 제한 | "{필드명}은 {min}자에서 {max}자 사이여야 합니다" | 길이 제한 위반 | 오류 표시, 제출 방지 |
| JavaScript 비활성화 | "JavaScript를 활성화해주세요" | 브라우저에서 JS 비활성화 | 기본 HTML 폼 동작 |

### 6.2 Error Display Pattern

```html
<!-- 오류 메시지 구조 -->
<div class="error-msg" data-for="email" id="email-error" aria-live="polite">
  유효한 이메일 주소를 입력해주세요
</div>
```

```css
/* 오류 메시지 스타일 */
.error-msg {
  display: none;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-msg.visible {
  display: block;
}

input.invalid,
textarea.invalid {
  border-color: #dc2626;
}
```

---

## 7. Security Considerations

- [✅] 입력 검증: XSS 예방을 위한 특수 문자 필터링 (필요시)
- [✅] HTML 이스케이프: 사용자 입력 표시 시 이스케이프 처리
- [✅] HTTPS: 프로덕션 환경에서 HTTPS 사용 (배포 시)
- [ ] CSRF 토큰: 백엔드 연동 시 (현재 미적용)
- [ ] 속도 제한: 연속 폼 제출 방지 (백엔드 연동 시)

---

## 8. Test Plan (v2.3.0)

> **CRITICAL**: Define WHAT to test here. Test CODE is written during Do phase alongside implementation.
> Do phase rule: code + test = 1 set. No module is "done" without its tests passing.
> Check phase: runs all tests, doesn't create new ones.

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: Manual Tests | 사용자 시나리오 | 브라우저 수동 테스트 | Do |
| L2: Console Tests | JavaScript 함수 | 브라우저 콘솔 | Do |
| L3: Accessibility Tests | 접근성 | WAVE 평가 도구 | Check |

### 8.2 L1: Manual Test Scenarios

> Define expected behavior for each user interaction.

| # | Scenario | Steps | Expected Result |
|---|----------|-------|-----------------|
| 1 | 빈 폼 제출 | 1. 모든 필드 빈 상태<br>2. 제출 버튼 클릭 | 모든 필드에 오류 메시지 표시, 제출 방지 |
| 2 | 유효한 데이터 입력 | 1. 유효한 이름(3자)<br>2. 유효한 이메일<br>3. 유효한 메시지(15자)<br>4. 제출 | 오류 없음, 폼 제출 가능 |
| 3 | 실시간 검증 | 1. 이메일 필드에 "invalid" 입력<br>2. 다른 필드 클릭 | 즉시 오류 메시지 표시 |
| 4 | 오류 수정 | 1. 오류 발생 후<br>2. 올바른 값 입력 | 오류 메시지 사라짐 |
| 5 | 키보드 내비게이션 | 1. Tab 키로 필드 이동<br>2. 오류 발생 필드에서 | 오류 메시지 읽힘 (스크린 리더) |
| 6 | 모바일 테스트 | 1. 모바일 장치에서<br>2. 터치 입력 | 반응형 디자인, 터치 친화적 |

### 8.3 L2: Console Test Scenarios

> JavaScript 함수 단위 테스트.

| # | Function | Test Input | Expected Output |
|---|----------|------------|-----------------|
| 1 | `validateName()` | "" (빈 문자열) | `{ isValid: false, error: "이름을 입력해주세요 (2-50자)" }` |
| 2 | `validateName()` | "A" (1자) | `{ isValid: false, error: "이름을 입력해주세요 (2-50자)" }` |
| 3 | `validateName()` | "John" (4자) | `{ isValid: true, error: null }` |
| 4 | `validateEmail()` | "invalid" | `{ isValid: false, error: "유효한 이메일 주소를 입력해주세요" }` |
| 5 | `validateEmail()` | "test@example.com" | `{ isValid: true, error: null }` |
| 6 | `validateMessage()` | "Short" (5자) | `{ isValid: false, error: "메시지를 입력해주세요 (10-1000자)" }` |
| 7 | `validateMessage()` | "This is a valid message that is long enough" (45자) | `{ isValid: true, error: null }` |

### 8.4 L3: Accessibility Test Scenarios

| # | Test | Tool | Success Criteria |
|---|------|------|-----------------|
| 1 | 키보드 내비게이션 | 수동 테스트 | Tab 키로 모든 필드 이동 가능 |
| 2 | 스크린 리더 호환성 | 수동 테스트 (또는 NVDA) | 오류 메시지 읽힘 |
| 3 | 색상 대비 | WAVE 도구 | 텍스트-배경 대비 4.5:1 이상 |
| 4 | ARIA 속성 | 브라우저 개발자 도구 | `aria-invalid`, `aria-describedby` 정확히 설정 |

### 8.5 Seed Data Requirements

> Tests need data. Define minimum seed data for tests to be meaningful.

| Test | 데이터 요구사항 |
|------|-----------------|
| 유효성 검증 | 다양한 입력 케이스 (빈 값, 잘못된 형식, 유효한 값) |
| 실시간 검증 | 사용자 입력 시뮬레이션 |
| 접근성 | 스크린 리더 테스트 환경 |

---

## 9. Clean Architecture

> Reference: `docs/01-plan/conventions.md` or Phase 2 Pipeline output

### 9.1 Layer Structure (Starter 레벨 적용)

| Layer | Responsibility | Location (이 프로젝트) |
|-------|---------------|------------------------|
| **Presentation** | UI 컴포넌트, 이벤트 처리 | `contact.html`, `js/components/form-validation.js` |
| **Application** | 비즈니스 로직, 검증 규칙 | `js/components/form-validation.js` (FormValidator 클래스) |
| **Domain** | 데이터 타입, 검증 규칙 정의 | Plan 문서의 Validation Rules (타입 정의) |
| **Infrastructure** | 브라우저 API, DOM 조작 | 브라우저 내장 API 사용 |

### 9.2 Dependency Rules (Starter 레벨)

```
┌─────────────────────────────────────────────────────────────┐
│                    Dependency Direction                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Presentation ──→ Application ──→ Domain ←── Infrastructure│
│      (HTML)          (JS 로직)     (규칙)       (브라우저 API)│
│                                                             │
│   Rule: Application은 Domain 규칙에 의존,                    │
│         Presentation은 Application에 의존                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 File Import Rules

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| Presentation (HTML) | (스크립트 태그) | - |
| Application (form-validation.js) | 브라우저 API, DOM | 다른 프레임워크 |
| Domain | - | 외부 의존성 없음 |

### 9.4 This Feature's Layer Assignment

| Component | Layer | Location |
|-----------|-------|----------|
| Contact Form HTML | Presentation | `contact.html` |
| FormValidator 클래스 | Application | `js/components/form-validation.js` |
| Validation Rules | Domain | 이 문서 §3.2 |
| DOM API 사용 | Infrastructure | 브라우저 내장 |

---

## 10. Coding Convention Reference

> Reference: `docs/01-plan/conventions.md` 또는 CLAUDE.md

### 10.1 Naming Conventions

| Target | Rule | Example (이 기능) |
|--------|------|-------------------|
| 클래스 | PascalCase | `FormValidator` |
| 함수 | camelCase | `validateEmail()`, `showError()` |
| 변수 | camelCase | `formElement`, `errorMessages` |
| 상수 | UPPER_SNAKE_CASE | `MIN_NAME_LENGTH = 2` |
| HTML ID | kebab-case | `contact-form`, `name-input` |
| CSS 클래스 | kebab-case | `.error-msg`, `.invalid` |
| 데이터 속성 | kebab-case | `data-for`, `data-validation` |

### 10.2 Import Order (JavaScript 모듈)

```javascript
// 1. 외부 라이브러리 (없음)
// 2. 내부 모듈 (없음 - 순수 JavaScript)
// 3. 상수 정의
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

// 4. 클래스 정의
class FormValidator {
  // ...
}

// 5. 이벤트 리스너 설정 (DOMContentLoaded 내부)
```

### 10.3 Environment Variables

| Variable | Purpose | Scope | 현재 상태 |
|----------|---------|-------|----------|
| `NODE_ENV` | 개발/프로덕션 환경 | Build | 설정 가능 (옵션) |

### 10.4 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| 함수명 | 동사 시작 (`validate`, `show`, `hide`) |
| 이벤트 리스너 | `addEventListener()` 사용 |
| 주석 | JSDoc 스타일, Design/Plan 참조 포함 |
| 오류 처리 | 사용자 친화적 메시지, 콘솔 오류 최소화 |
| 코드 구조 | 클래스 기반 모듈화 |

---

## 11. Implementation Guide

### 11.1 File Structure

```
project/
├── contact.html                    # 새 연락처 페이지
├── js/
│   ├── main.js                     # 수정: FormValidator 통합
│   └── components/
│       ├── navigation.js           # 기존
│       ├── lazy-loading.js         # 기존
│       └── form-validation.js      # 새 파일
├── css/
│   └── (기존 CSS 파일)             # .error-msg 스타일 추가
└── index.html                      # 수정: contact.html 링크 확인
```

### 11.2 Implementation Order

1. [ ] `contact.html` 생성 (연락처 폼 UI)
2. [ ] `js/components/form-validation.js` 생성 (FormValidator 클래스)
3. [ ] CSS 스타일 추가 (오류 메시지, invalid 상태)
4. [ ] `js/main.js` 수정 (FormValidator 인스턴스 생성 및 통합)
5. [ ] `index.html` 수정 (contact.html 링크 확인)
6. [ ] 테스트 및 검증

### 11.3 Session Guide

> Auto-generated from Design structure. Session split is recommended, not required.
> Use `/pdca do js --scope module-N` to implement one module per session.

#### Module Map

| Module | Scope Key | Description | Estimated Turns |
|--------|-----------|-------------|:---------------:|
| HTML 구조 생성 | `module-1` | contact.html 생성, 기본 폼 구조 | 15-20 |
| JavaScript 검증 로직 | `module-2` | form-validation.js 구현 | 20-25 |
| 통합 및 스타일링 | `module-3` | main.js 통합, CSS 스타일, 테스트 | 15-20 |

#### Recommended Session Plan

| Session | Phase | Scope | Turns |
|---------|-------|-------|:-----:|
| Session 1 | Plan + Design | 전체 | 30-35 (완료) |
| Session 2 | Do | `--scope module-1` (HTML 구조) | 40-50 |
| Session 3 | Do | `--scope module-2` (JavaScript) | 40-50 |
| Session 4 | Do | `--scope module-3` (통합 및 테스트) | 40-50 |
| Session 5 | Check + Report | 전체 | 30-40 |

> **참고**: 각 모듈은 독립적으로 구현 가능. 예: `module-1`만 구현하고 중단 가능.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-17 | Initial draft | 사용자 |
