# bkit - Starter 프로젝트 개발 가이드

> Starter 레벨: 정적 웹사이트 개발 (HTML/CSS/JS 또는 Next.js)

## 📋 프로젝트 정보
- **레벨**: Starter (초보자 친화적)
- **권장 기술 스택**: HTML5, CSS3, JavaScript 또는 Next.js 14+
- **배포**: GitHub Pages (정적) 또는 Vercel (Next.js)

## 🎯 개발 원칙

### 1. 초보자 중심 디자인
- 모든 설명은 비전공자도 이해할 수 있도록 작성
- 코드 예제는 최대한 간결하고 직관적으로
- 실수 방지를 위한 체크리스트 제공

### 2. 점진적 복잡성
- 단계별 학습: HTML → CSS → JavaScript → (선택) Next.js
- 각 단계 완료 후 다음 단계로 진행
- 처음에는 정적 페이지, 점진적으로 동적 기능 추가

### 3. AI 친화적 코드
- 의미 있는 변수명 사용 (`button`, `header`, `mainContent`)
- 주석으로 의도 설명 (한국어 가능)
- 일관된 코드 스타일 유지

## 🚫 금지 사항

### 코드 품질
- ❌ `console.log()` 프로덕션 코드 사용 금지 → 디버깅 후 반드시 제거
- ❌ 인라인 스타일 (`style="color: red;"`) → CSS 클래스 사용
- ❌ `<br>` 태그 연속 사용 → CSS margin/padding으로 공백 처리

### 보안
- ❌ 하드코딩된 API 키, 비밀번호
- ❌ CDN에서 불러오지 않은 외부 스크립트 (보안 검증 필요)

### 접근성
- ❌ 이미지에 `alt` 텍스트 없음
- ❌ 색상만으로 정보 전달 (색맹 사용자 고려)
- ❌ 키보드로 접근 불가능한 인터랙션

## ✅ 필수 사항

### HTML
- ✅ 시맨틱 태그 사용 (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ `lang` 속성 설정 (`<html lang="ko">`)
- ✅ 반응형 메타 태그: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- ✅ 이미지: `width`, `height` 속성 지정 (레이아웃 시프트 방지)

### CSS
- ✅ 모바일 퍼스트 접근법
- ✅ CSS 변수 사용 (색상, 폰트 크기 등)
- ✅ Flexbox/Grid 레이아웃 사용 (float 금지)

### JavaScript
- ✅ `const`/`let` 사용 (`var` 금지)
- ✅ 이벤트 리스너는 `addEventListener()` 사용 (인라인 `onclick` 지양)
- ✅ 비동기 코드는 `async`/`await` 사용 (가독성)

### Next.js (선택)
- ✅ App Router 사용 (Pages Router 대신)
- ✅ Server Components 기본, Client Components 필요한 경우만
- ✅ Tailwind CSS 권장 (빠른 스타일링)

## 🛠️ 개발 워크플로우

### 1. 기획 단계
```
1. docs/01-plan/features/{기능명}.plan.md 작성
2. 사용자 시나리오 정의
3. 페이지 구조 (와이어프레임) 설계
```

### 2. 디자인 단계  
```
1. docs/02-design/features/{기능명}.design.md 작성
2. 컴포넌트 구조 정의
3. 색상, 타이포그래피 시스템 설계
```

### 3. 구현 단계
```
1. HTML/CSS 먼저 완성
2. JavaScript 기능 추가
3. 반응형 테스트 (모바일 → 태블릿 → 데스크톱)
```

### 4. 검증 단계
```
1. 접근성 검사 (WAVE, Lighthouse)
2. 성능 검사 (PageSpeed Insights)
3. 크로스 브라우저 테스트
```

## 📁 프로젝트 구조

### 옵션 A: 순수 HTML/CSS/JS
```
project/
├── index.html              # 메인 페이지
├── about.html              # 소개 페이지
├── contact.html            # 연락처 페이지
├── css/
│   ├── style.css           # 기본 스타일
│   ├── components.css      # 컴포넌트 스타일
│   └── responsive.css      # 반응형 스타일
├── js/
│   ├── main.js             # 공통 기능
│   ├── navigation.js       # 네비게이션
│   └── form-validation.js  # 폼 검증
├── images/                 # 이미지 파일
├── docs/                   # PDCA 문서
│   ├── 01-plan/
│   ├── 02-design/
│   ├── 03-analysis/
│   └── 04-report/
└── README.md
```

### 옵션 B: Next.js
```
project/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 공통 레이아웃
│   │   ├── page.tsx            # 메인 페이지
│   │   ├── about/
│   │   │   └── page.tsx        # 소개 페이지
│   │   └── contact/
│   │       └── page.tsx        # 연락처 페이지
│   ├── components/             # 재사용 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Button.tsx
│   └── styles/                 # 스타일 파일
│       ├── globals.css
│       └── components.css
├── public/                     # 정적 파일
├── docs/                       # PDCA 문서
├── package.json
├── tailwind.config.js
└── README.md
```

## 🔧 도구 및 설정

### 포매터 (자동 코드 정리)
- **권장**: Prettier
- **설정**: `.prettierrc` 파일 생성
- **실행**: `/format` 명령어 사용

### 코드 검사
- **HTML**: W3C Validator 사용
- **CSS**: Stylelint 설정
- **JavaScript**: ESLint (기본 규칙)

### 개발 서버
- **HTML/CSS/JS**: Live Server 확장 프로그램
- **Next.js**: `npm run dev` (자동 새로고침)

## 🧪 테스트 체크리스트

### 기능 테스트
- [ ] 모든 링크 정상 작동
- [ ] 폼 제출 동작 확인
- [ ] 모바일 메뉴 토글 작동
- [ ] 이미지 로드 확인

### 성능 테스트  
- [ ] Lighthouse 점수 90 이상
- [ ] 첫 콘텐츠풀 페인트 (FCP) < 1.5초
- [ ] 누적 레이아웃 시프트 (CLS) < 0.1

### 접근성 테스트
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 스크린 리더로 내용 이해 가능
- [ ] 색상 대비 충분 (4.5:1 이상)

## 📚 학습 리소스

### HTML/CSS
- MDN Web Docs (한국어)
- CSS Tricks
- Frontend Mentor (실습 문제)

### JavaScript
- JavaScript.info (한국어)
- Eloquent JavaScript
- You Don't Know JS 시리즈

### Next.js
- 공식 문서 (한국어)
- Next.js Learn
- Vercel 예제 저장소

## 🔄 레벨 업그레이드 조건

**Dynamic 레벨로 업그레이드 고려** (다음 조건 중 1개 이상 충족 시):
- 로그인/회원가입 기능 필요
- 데이터 저장 (데이터베이스) 필요
- 실시간 업데이트 필요
- 관리자 페이지 필요
- 결제 기능 통합 필요

---

## 🤖 Claude Code 설정

### 권장 출력 스타일
```
/output-style bkit-learning
```

### 자주 사용하는 명령어
- `/starter guide` - 개발 가이드 표시
- `/format` - 코드 자동 정리
- `/pdca status` - 진행 상황 확인

### 메모리 시스템
- bkit 에이전트가 자동으로 학습 진행 상황 기억
- 수동 메모리는 `/memory` 명령어로 관리

---
*이 문서는 팀의 집단 지성입니다. 새로운 규칙이 발견되면 추가해주세요.*
*Claude는 완벽하지 않습니다. 중요한 결정은 항상 확인하세요.* 🛡️