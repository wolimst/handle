<p align='center'>
  <img src='./public/resources/icons/wide-icon.svg' width='250'/>
</p>

<p align='center'>Handle [ha(ː)n-dle] - A wordle with assembled Korean letters </p>

<p align='center'>
  English | <a href='./README.md'>한국어</a>
</p>

<p align='center'>
  <a href='https://github.com/wolimst/handle/actions/workflows/ci.yml'>
    <img src='https://github.com/wolimst/handle/actions/workflows/ci.yml/badge.svg'/>
  </a>
  <a href='https://github.com/wolimst/handle/actions/workflows/deploy.yml'>
    <img src='https://github.com/wolimst/handle/actions/workflows/deploy.yml/badge.svg'/>
  </a>
</p>

## Handle (한들)

Handle \[ha(ː)n-dle\] is a Korean variant of the word guessing game [Wordle][wordle-wiki].

Handle is designed to use assembled [Hangul jamo][hangul-letters-wiki] (the Korean alphabet)
to make the word guessing process most natural to Korean language,
since a Korean syllable is formed by combining multiple Hangul jamo.

There are several game modes, such as 오늘의 문제 (Daily play), 자유 모드 (Free play)
and 두들 (Du-dle, play 2 wordles at once, like [Dordle][dordle-game]).

## FAQ

### Words not in word list.

If there are words that you wish to add to the word list, please leave them in [this issue][add-new-words].

### I want this new feature / I found a bug!

Please submit an issue [here][issues] for feature requests and bug reports.

### There are already existing wordle games with assembled Hangul. What's different?

In existing wordle games with assembled Hangul, the results of a guess are shown
for each syllables or initial/medial/final jamo groups.
However, in Handle, the results are shown for each jamo, which means composed jamo
like `ㄳ` or `ㅘ` will be decomposed and handled as `ㄱ`/`ㅅ` and `ㅗ`/`ㅏ` when showing results.
Therefore, the difficulty of guessing complicated syllables like 흙 is lowered,
and those syllables can easily be used to guess other syllables.

And most of all, it is easy to recognize the result on a guess
because the result is colored _on each Jamo_ in an assembled letter.

### Are there any other wordle games?

Here are wordles that I enjoyed playing. I gained insights from those games that helped developing Handle.

- [Wordle][wordle-game]: The original Wordle
- [Dordle][dordle-game]: Play 2 wordles at once
- [Quordle][quordle-game]: Play 4 wordles at once
- [Kordle][kordle-game]: A wordle with unassembled Korean letters

## Contributing

If you have ideas on this project or found bugs, please open up an issue [here][issues]

For details on development, please refer to [Contributing][contributing].

Thanks to everyone who contributed on this project!

[wordle-wiki]: https://en.wikipedia.org/wiki/Wordle
[hangul-letters-wiki]: https://en.wikipedia.org/wiki/Hangul#Letters
[add-new-words]: https://github.com/wolimst/handle/issues/7
[issues]: https://github.com/wolimst/handle/issues
[dordle-game]: https://zaratustra.itch.io/dordle
[wordle-game]: https://www.nytimes.com/games/wordle/index.html
[quordle-game]: https://www.quordle.com/
[kordle-game]: https://kordle.kr/
[contributing]: ./CONTRIBUTING.md
