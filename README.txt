HABI :B — SITE (메인 테마 확장본)

받은 풀스크린 커버(FILM / AFTER DARK) 테마를 그대로 상속해서
나머지 5개 페이지를 같은 다크·핫핑크 편집 무드로 제작.

[ 구성 ]
index.html            메인 커버 (받은 원본 유지 + 상단 nav·문의·테마토글만 추가)
profile/index.html    프로필 (도시에·좋아싫어·능력치·링크)
schedule/index.html   일정 (주간 / 월간 전환, 이벤트 방송 표시)
song/index.html       노래책 (애창곡 임베드 + 장르 필터 + 검색)
dress/index.html      옷장 (새옷 포스터 / 기존 그리드 + 분류탭 + 라이트박스)
work/index.html       업보 (시청자 카드 + 일반/이벤트 탭 + 상세 모달 + 검색)
site.css / site.js    서브페이지 공통 테마·동작
style.css / app.js    커버 전용 (원본)
fx.js                 공통 연출 (떠다니는 하트·꽃 + 클릭 톡)
assets/habi-cover.webp

[ 메뉴 ]  메인 · 프로필 · 일정 · 노래책 · 옷장 · 업보  (6개)
[ 공통 ]  흑/백 테마 전환(localStorage 기억) · 모바일 대응 · SOOP 파비콘 · 문의 모달(ESC 닫힘)

[ 지금은 샘플 데이터 ]
노래책 곡목록 / 옷장 룩 / 업보 시청자 목록은 각 파일 하단 <script>의
배열(SONGS · LOOKS · VIEWERS)에 들어 있는 예시. 실제 데이터로 교체 필요.
- 옷장 이미지: 실제 URL로 교체하고 <img referrerpolicy="no-referrer">, 3:4 크롭
- 업보 아바타: SOOP 아이디로 프사 자동, 실패 시 닉 첫 글자 폴백 (이미 동작)

[ 스프레드시트 이관 ]
한 줄씩 손으로 옮길 필요 없음. 시트를 CSV로 받아 배열/DB로 한 번에 넣는다.
현재는 위 배열에 붙여넣기만 하면 되고, DB 연동 단계에서는 CSV → INSERT 로 일괄 이관.
업보 이벤트 방셀(어린이날·여름 수영복 등)은 시청자별 counts 객체의 키로 관리 —
탭(일반/이벤트)은 이미 그 키를 읽어 자동 분리.

[ 다음 단계 (디자인 확정 후) ]
아직 정적 버전. 확정되면 표준 파이프라인대로 Supabase 연동 + 관리자 페이지 제작.
그때 곡·룩·업보·일정을 관리자에서 편집하도록 배선.

[ 배포 ]
폴더 구조 그대로 GitHub 업로드 → Cloudflare Pages(Framework=None).
pcview.js 도 루트에 같이 올린다(전 페이지가 참조).

[ 모바일 · 숲 임베드 (v4.6) ]
- 폰 브라우저: 뷰포트 width=1180 이라 폰에서도 PC 배치로 뜬다(카테고리 가로 메뉴).
- 숲 게시글: iframe src 에 페이지 주소를 그대로 넣는다 (예: 배포주소/profile/).
  중첩 iframe·래퍼 주소는 앱을 무한 새로고침시키므로 절대 금지.
  ```html
  <iframe height="2400" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;"></iframe>
  ```
- 숲 앱 안에서 PC로 보려면 화면 상단 'PC 화면 ↗' 버튼(임베드에서만 노출). ?pc=1 로 인앱 브라우저에서 PC 배치.
- 임베드 안전: nav·연출·모달이 iframe 안에서 문서 기준(absolute)으로 뜨고, 모바일 메뉴는 nav 드롭다운.
