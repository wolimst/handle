<p align='center'>
  <img src='./public/resources/icons/wide-icon.svg' width='250'/>
</p>

<p align='center'>한들 - 모아쓰는 한글 워들</p>

<p align='center'>
  한국어 | <a href='./README.en.md'>English</a>
</p>

<p align='center'>
  <a href='https://github.com/wolimst/handle/actions/workflows/ci.yml'>
    <img src='https://github.com/wolimst/handle/actions/workflows/ci.yml/badge.svg'/>
  </a>
  <a href='https://github.com/wolimst/handle/actions/workflows/deploy.yml'>
    <img src='https://github.com/wolimst/handle/actions/workflows/deploy.yml/badge.svg'/>
  </a>
</p>

## 한들

한들은, 영어 단어 맞추기 게임인 [워들][wordle-wiki]의 한글 버전이에요.

한 글자가 하나의 알파벳으로 나타내지는 영어와 달리 한 글자가 자모의 조합으로 이루어지는 한글의 특성을 살려,
모아쓰기 된 한글 단어를 입력하여 플레이하도록 하였어요.

또한, 한국 시간 자정에 문제가 갱신되는 '오늘의 문제'와 자유롭게 몇 번이든 플레이 할 수 있는 '자유 모드',
동시에 2개의 워들을 풀어야 하는 '두들' 등, 다양한 모드를 플레이 할 수 있어요.

## FAQ

### 단어를 추가해주세요.

단어 리스트에 없는 단어가 있다면, [단어 추가 요청][add-new-words]에 단어를 남겨주세요.

### 이런 기능을 추가해주세요 / 문제점을 발견했어요.

기능 추가 요청이나 버그 리포트는 이 레포지토리의 [이슈][issues]에 등록해주세요.

### 다른 한글 모아쓰기형 워들도 이미 존재하는 것 같은데요, 한들은 어떤 점이 다른가요?

다른 모아쓰기형 워들은, 추측 결과를 글자 단위 혹은 초성/중성/종성 단위로 표시하지만,
한들에서는 한 글자를 구성하는 자모 단위로 결과를 표시해요.
즉, `ㄳ` 이나 `ㅘ` 같은 자모의 조합은, `ㄱ`/`ㅅ` 과 `ㅗ`/`ㅏ` 로 분리하여 처리되어요.
이를 통해, '흙'과 같은 복잡한 글자의 추측 난이도를 낮추고, 다른 글자의 추측에 활용할 수 있게 하였어요.

그리고 무엇보다, 모아쓰기 된 글자의 각 자모에 직접 색을 입혀서 추측 결과를 표시함으로서,
추측 결과를 알아보기 쉽게 하였답니다!

### 다른 워들도 플레이 해보고 싶어요

아래에 제가 재미있게 플레이 한 워들을 남겨놓았어요. 한들의 개발에도 많은 참고가 되었답니다.

- [Wordle][wordle-game]: 오리지널 영어 워들
- [Dordle][dordle-game]: 2개의 영어 워들을 동시에 풀기
- [Quordle][quordle-game]: 4개의 영어 워들을 동시에 풀기
- [꼬들][kordle-game]: 한글 풀어쓰기형 워들

## 공헌하기

프로젝트에 관한 아이디어가 있거나 발견한 문제점 등이 있다면, [이슈][issues]에 남겨주세요.

개발에 관련한 부분은 [Contributing][contributing] 을 참고해주세요.

프로젝트에 공헌해주시는 모든 분에게 감사드립니다.

[wordle-wiki]: https://ko.wikipedia.org/wiki/%EC%9B%8C%EB%93%A4
[add-new-words]: https://github.com/wolimst/handle/issues/7
[issues]: https://github.com/wolimst/handle/issues
[wordle-game]: https://www.nytimes.com/games/wordle/index.html
[dordle-game]: https://zaratustra.itch.io/dordle
[quordle-game]: https://www.quordle.com/
[kordle-game]: https://kordle.kr/
[contributing]: ./CONTRIBUTING.md
