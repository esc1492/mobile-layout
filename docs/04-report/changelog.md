# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-04-16] - 모바일 퍼스트 레이아웃 완료

### Added
- 모바일 퍼스트 반응형 레이아웃 시스템 구현
- 햄버거 메뉴 기반 모바일 네비게이션 컴포넌트
- 12열 반응형 CSS Grid 시스템
- CSS 디자인 토큰 변수 시스템 (40+ 변수)
- 이미지 지연 로딩 (Intersection Observer API)
- 접근성 기능: ARIA 속성, 키보드 내비게이션, 스크린 리더 지원
- 다크모드 지원 (`prefers-color-scheme: dark`)
- 확장된 브레이크포인트 시스템 (7단계)

### Changed
- 브레이크포인트 시스템 3단계에서 7단계로 확장
- CSS 변수 시스템 확장 (색상, 타이포그래피, 간격, 브레이크포인트)
- 디자인 문서 구조 단순화 (`footer.css` 통합)

### Fixed
- `console.log()` 프로덕션 코드 제거 (CLAUDE.md 준수)
- 디자인-구현 불일치 해결
- 접근성 오버레이 자동 생성 로직 개선

### PDCA Documents
- ✅ Plan: `docs/01-plan/features/모바일-퍼스트-레이아웃.plan.md`
- ✅ Design: `docs/02-design/features/모바일-퍼스트-레이아웃.design.md`
- ✅ Analysis: `docs/03-analysis/모바일-퍼스트-레이아웃.analysis.md`
- ✅ Report: `docs/04-report/모바일-퍼스트-레이아웃.report.md`

### Technical Details
- **Match Rate**: 91% → 96% (after iteration fixes)
- **Success Criteria**: 5/5 완료 (100%)
- **Convention Compliance**: 83% → 100%
- **Code Traceability**: 100% (모든 주요 파일에 설계 참조 주석)

---

## [Unreleased]

### Planned
- 폼 검증 시스템 구현
- 다크모드 토글 기능 추가
- 이미지 갤러리 컴포넌트 개발
- 성능 테스트 자동화 설정
- 크로스 브라우저 테스트 완료