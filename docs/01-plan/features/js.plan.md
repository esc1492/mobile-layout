# js (연락처 폼 검증) Planning Document

> **Summary**: 연락처 폼에 대한 클라이언트 측 JavaScript 검증 기능 구현
>
> **Project**: bkit - Starter
> **Version**: 1.0.0
> **Author**: 사용자
> **Date**: 2026-04-17
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 사용자가 연락처 폼을 제출할 때 잘못된 정보(잘못된 이메일 형식, 빈 필드)를 입력하면 서버 측 오류가 발생하거나 메시지가 전송되지 않는 문제 |
| **Solution** | 클라이언트 측 JavaScript 폼 검증을 구현하여 실시간 오류 피드백을 제공하고, 접근성을 고려한 사용자 친화적 인터페이스 제공 |
| **Function/UX Effect** | 사용자가 폼 입력 중 즉시 오류를 확인하고 수정할 수 있어 사용자 경험 향상, 폼 제출 전 오류 예방 |
| **Core Value** | 폼 제출 성공률 향상과 사용자 불만 감소로 웹사이트 효과성 증대 |

---

## Context Anchor

> Auto-generated from Executive Summary. Propagated to Design/Do documents for context continuity.

| Key | Value |
|-----|-------|
| **WHY** | 잘못된 폼 입력으로 인한 서버 오류와 사용자 불만 해결 |
| **WHO** | 웹사이트 방문자, 연락처 폼을 사용하는 사용자 |
| **RISK** | JavaScript 비활성화 환경에서 작동 안 함, 브라우저 호환성 문제 |
| **SUCCESS** | 모든 검증 규칙 정상 작동, Lighthouse 성능 점수 90+ 유지, WCAG 2.1 AA 준수 |
| **SCOPE** | Phase 1: 기본 검증 로직 → Phase 2: 실시간 피드백 → Phase 3: 접근성 향상 → Phase 4: 테스트 및 최적화 |

---

## 1. Overview

### 1.1 Purpose

연락처 폼에 대한 클라이언트 측 JavaScript 검증 기능을 구현하여 사용자가 폼을 제출하기 전에 입력 오류를 즉시 확인하고 수정할 수 있도록 하는 것. 이를 통해 사용자 경험을 향상시키고 서버 부하를 줄이며 폼 제출 성공률을 높입니다.

### 1.2 Background

웹사이트 연락처 폼은 사용자와의 주요 소통 채널입니다. 잘못된 입력으로 인한 폼 제출 실패는 사용자 불만과 비즈니스 기회 손실로 이어집니다. 클라이언트 측 검증은 실시간 피드백을 제공하여 이러한 문제를 해결하고, 접근성 기준을 준수하여 모든 사용자가 폼을 쉽게 사용할 수 있도록 합니다.

### 1.3 Related Documents

- Requirements: 이 문서
- References: CLAUDE.md (프로젝트 개발 가이드), 모바일-퍼스트-레이아웃.plan.md

---

## 2. Scope

### 2.1 In Scope

- [ ] 연락처 폼 기본 필드 검증 (이름, 이메일, 메시지)
- [ ] 실시간 입력 검증 (onInput/onChange 이벤트)
- [ ] 오류 메시지 표시 (인라인 형식)
- [ ] 접근성 지원 (ARIA 속성, 키보드 내비게이션)
- [ ] 폼 제출 전 최종 검증
- [ ] 성능 최적화 (번들 크기, 실행 시간)
- [ ] 크로스 브라우저 호환성 (최신 브라우저 2개 버전)

### 2.2 Out of Scope

- 서버 측 검증 (클라이언트 검증 보완용)
- CAPTCHA 또는 봇 방지 기능
- 파일 업로드 검증
- 다국어 오류 메시지
- Internet Explorer 11 이하 지원

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 이름 필드 검증: 필수 입력, 최소 2자, 최대 50자 | High | Pending |
| FR-02 | 이메일 필드 검증: 필수 입력, 유효한 이메일 형식 | High | Pending |
| FR-03 | 메시지 필드 검증: 필수 입력, 최소 10자, 최대 1000자 | High | Pending |
| FR-04 | 실시간 검증: 사용자 입력 중 오류 즉시 표시 | Medium | Pending |
| FR-05 | 폼 제출 시 최종 검증: 모든 필드 통과 시만 제출 가능 | High | Pending |
| FR-06 | 오류 메시지 표시: 각 필드 아래에 명확한 오류 메시지 | Medium | Pending |
| FR-07 | 접근성 지원: ARIA 속성, 키보드 탐색, 스크린 리더 호환 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | Lighthouse 성능 점수 90+ 유지 | Google Lighthouse |
| Accessibility | WCAG 2.1 AA 준수 (폼 관련 기준) | WAVE 접근성 평가 도구 |
| Browser Compatibility | Chrome, Safari, Firefox, Edge 최근 2개 버전 | 실제 브라우저 테스트 |
| Load Time | JavaScript 번들 추가로 인한 FCP 증가 < 100ms | WebPageTest 비교 |
| Maintainability | 모듈화된 코드, 주석 처리, 문서화 | 코드 리뷰 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 기능 요구사항 (FR-01~FR-07) 구현 완료
- [ ] 단위 테스트 작성 및 통과 (있는 경우)
- [ ] 코드 리뷰 완료
- [ ] 문서화 완료 (주석, README)
- [ ] Lighthouse 성능 점수 90+ 달성
- [ ] WAVE 접근성 검사 통과 (폼 관련 기준)
- [ ] 지정된 브라우저에서 정상 작동 확인

### 4.2 Quality Criteria

- [ ] ESLint/Prettier 오류 없음
- [ ] JavaScript 오류 없음 (콘솔)
- [ ] 반응형 디자인에서도 정상 작동
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 스크린 리더로 오류 메시지 인식 가능

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| JavaScript 비활성화 환경 | Medium | Low | Progressive Enhancement 적용, 서버 측 검증으로 폴백 |
| 브라우저 호환성 문제 | Medium | Medium | 기능 탐지(feature detection), 폴백 구현 |
| 성능 저하 (모바일) | Low | Low | 코드 최적화, 지연 로딩 고려 |
| 접근성 미준수 | High | Medium | 접근성 검사 도구 통합, 스크린 리더 테스트 |
| 코드 유지보수성 낮음 | Medium | Medium | 모듈화 설계, 문서화 강화 |

---

## 6. Impact Analysis

> **Purpose**: List every existing consumer of the resources being changed.
> Changes can break existing functionality in unexpected ways.
> This section forces a full inventory of current usage before making changes.

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| 연락처 폼 HTML | HTML 구조 | 데이터 속성 추가 (data-validation), 오류 메시지 컨테이너 |
| JavaScript 검증 모듈 | JavaScript 파일 | 새 파일 생성: `js/components/form-validation.js` |
| 기존 JavaScript 구조 | 기존 JS 파일 | `js/main.js`에 검증 모듈 통합 |

### 6.2 Current Consumers

현재 연락처 폼이 있는지 확인 필요. 새 기능이므로 기존 소비자는 없을 수 있음.

### 6.3 Verification

- [ ] 새로운 JavaScript 파일이 기존 기능에 영향을 미치지 않음 확인
- [ ] HTML 구조 변경이 기존 스타일에 영향 미치지 않음 확인
- [ ] `js/main.js` 수정이 다른 모듈과 충돌하지 않음 확인

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ✅ |
| **Dynamic** | Feature-based modules, BaaS integration (bkend.ai) | Web apps with backend, SaaS MVPs, fullstack apps | ☐ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| Framework | Next.js / React / Vue | Vanilla JavaScript | Starter 레벨, 순수 JavaScript 학습 |
| Validation Library | validator.js / yup / custom | Custom validation | 간단한 요구사항, 의존성 최소화 |
| State Management | Context / Zustand / Redux / Jotai | DOM 상태 관리 | 단순한 폼 검증, 외부 상태 관리 불필요 |
| Event Handling | jQuery / vanilla event listeners | Vanilla event listeners | 현대 JavaScript 표준 준수 |
| Error Display | Inline / Toast / Modal | Inline (필드 아래) | 즉시적인 피드백, 사용자 친화적 |
| Accessibility | Basic ARIA / Full accessibility suite | WCAG 2.1 AA 준수 | 모든 사용자 접근성 보장 |

### 7.3 Clean Architecture Approach

```
Selected Level: Starter

Folder Structure Preview:
js/
├── main.js                  # 애플리케이션 진입점
├── components/
│   ├── navigation.js        # 기존 네비게이션
│   ├── lazy-loading.js      # 기존 지연 로딩
│   └── form-validation.js   # 새 폼 검증 모듈
└── utils/                   # 향후 유틸리티 함수
```

---

## 8. Convention Prerequisites

### 8.1 Existing Project Conventions

Check which conventions already exist in the project:

- [✅] `CLAUDE.md` has coding conventions section
- [ ] `docs/01-plan/conventions.md` exists (Phase 2 output)
- [ ] `CONVENTIONS.md` exists at project root
- [ ] ESLint configuration (`.eslintrc.*`)
- [ ] Prettier configuration (`.prettierrc`)
- [ ] TypeScript configuration (`tsconfig.json`)

### 8.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **JavaScript Naming** | missing | camelCase 변수/함수, PascalCase 클래스, UPPER_CASE 상수 | High |
| **File Organization** | exists | `js/components/` 구조 유지, 기능별 모듈 분리 | Medium |
| **Error Handling** | missing | try-catch 블록, 사용자 친화적 오류 메시지 | Medium |
| **Code Comments** | exists | JSDoc 형식 주석, Design/Plan 참조 주석 | Medium |
| **Event Listeners** | missing | `addEventListener()` 사용, 인라인 이벤트 처리기 지양 | High |

### 8.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `NODE_ENV` | 개발/프로덕션 환경 구분 | Build | ☐ |

### 8.4 Pipeline Integration

If using 9-phase Development Pipeline, check the following:

| Phase | Status | Document Location | Command |
|-------|:------:|-------------------|---------|
| Phase 1 (Schema) | ☐ | `docs/01-plan/schema.md` | `/pipeline-next` |
| Phase 2 (Convention) | ☐ | `docs/01-plan/conventions.md` | `/pipeline-next` |

**Pipeline Templates Available:**
- `templates/pipeline/phase-1-schema.template.md`
- `templates/pipeline/phase-2-convention.template.md`

**Quick Start:**
```bash
# Check pipeline status
/pipeline-status

# Start pipeline from Phase 1
/pipeline-start

# Go to next phase
/pipeline-next
```

---

## 9. Next Steps

1. [ ] Write design document (`js.design.md`)
2. [ ] Team review and approval
3. [ ] Start implementation

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-17 | Initial draft | 사용자 |
