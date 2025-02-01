import { useState } from 'react';
import './App.css';
import { Scanner } from "./parse";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Options, termToString, trans } from './code';

function App() {
  const [inputA, setInputA] = useState("");
  const [output, setOutput] = useState("出力：");
  const [outputError, setOutputError] = useState("");
  const [options, setOptions] = useState<Options>({
    checkOnOffo: false,
    checkOnOffO: false,
    checkOnOffA: false,
    checkOnOffB: false,
    checkOnOffT: false,
  });
  const [showHide, setShowHide] = useState(false);

  const compute = () => {
    setOutput("");
    setOutputError("");
    try {
      const x = inputA ? new Scanner(inputA).parse_term() : null;
      if (x === null) throw Error("Aの入力が必要です");
      const outputString = termToString(trans(x),options);
      setOutput(`出力：${options.checkOnOffT ? `$${outputString}$` : outputString}`);
    } catch (error) {
      if (error instanceof Error) setOutputError(error.message);
      else setOutputError("不明なエラー");
      console.error("Error in compute:", error);
    }
  };

  const handleCheckboxChange = (key: keyof Options) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: !prevOptions[key],
    }));
  };

  return (
    <div className="app">
      <header>亞関数からブーフホルツのψへの変換写像</header>
      <main>
        <p className="rdm">
          入力は、任意の0 &lt; nに対して、亞(a_n,a_&#123;n-1&#125;,...,a_2,a_1,a_0), 亞_&#123;a_n&#125;(a_a_&#123;n-1&#125;,...,a_2,a_1,a_0)の形式で行ってください。<br />
          _, &#123;, &#125;は省略可能です。<br />
          略記として、1 := 亞(0), n := 1 + 1 + ...(n個の1)... + 1, ω := 亞(1), Ω := 亞(1,0), I := 亞(1,0,0)が使用可能。<br />
          また、亞はAで、ωはwで、ΩはWで代用可能。
        </p>
        A:
        <input
          className="input is-primary"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          type="text"
          placeholder="入力A"
        />
        <div className="block">
          <button className="button is-primary" onClick={() => compute()}>
            変換
          </button>
        </div>
        <input type="button" value="オプション" onClick={() => setShowHide(!showHide)} className="button is-primary is-light is-small" />
        {showHide && (
          <ul>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffo} onChange={() => handleCheckboxChange('checkOnOffo')} />
              &nbsp;ψ{options.checkOnOffB ? `(1)` : `${options.checkOnOffA ? `_0(1)` : `(0,1)`}`}をωで出力
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffO} onChange={() => handleCheckboxChange('checkOnOffO')} />
              &nbsp;ψ_1(0)をΩで出力
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffA} onChange={() => handleCheckboxChange('checkOnOffA')} />
              &nbsp;ψ_a(b)をψ(a,b)で表示
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffB} onChange={() => handleCheckboxChange('checkOnOffB')} />
              &nbsp;ψ_0(b)をψ(b)で表示
            </label></li>
            <li><label className="checkbox">
              <input type="checkbox" checked={options.checkOnOffT} onChange={() => handleCheckboxChange('checkOnOffT')} />
              &nbsp;TeXで出力
            </label></li>
          </ul>
        )}
        <div className="box is-primary">
          {outputError !== "" ? (
            <div className="notification is-danger">{outputError}</div>
          ) : (
            <div>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {output}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
      <footer>
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E7%AB%B9%E5%8F%96%E7%BF%81/%E5%A4%9A%E5%A4%89%E6%95%B0%E4%BA%9E%E9%96%A2%E6%95%B0%E3%81%8B%E3%82%89Buchholz_OCF%E3%81%AB%E4%BC%B4%E3%81%86%E9%A0%86%E5%BA%8F%E6%95%B0%E8%A1%A8%E8%A8%98%E3%81%B8%E3%81%AE%E5%A4%89%E6%8F%9B%E5%86%99%E5%83%8F" target="_blank" rel="noreferrer">ユーザーブログ:竹取翁/多変数亞関数からBuchholz OCFに伴う順序数表記への変換写像 | 巨大数研究 Wiki | Fandom</a>(2024/11/26 閲覧)<br />
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E7%AB%B9%E5%8F%96%E7%BF%81/%E5%A4%9A%E5%A4%89%E6%95%B0%E4%BA%9E%E9%96%A2%E6%95%B0" target="_blank" rel="noreferrer">ユーザーブログ:竹取翁/多変数亞関数 | 巨大数研究 Wiki | Fandom</a>(2024/11/24 閲覧)<br />
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:P%E9%80%B2%E5%A4%A7%E5%A5%BD%E3%81%8Dbot/%E6%8B%A1%E5%BC%B5Buchholz_OCF%E3%81%AB%E4%BC%B4%E3%81%86%E9%A0%86%E5%BA%8F%E6%95%B0%E8%A1%A8%E8%A8%98" target="_blank" rel="noreferrer">ユーザーブログ:P進大好きbot/拡張Buchholz OCFに伴う順序数表記 | 巨大数研究 Wiki | Fandom</a>(2024/11/24 閲覧)<br />
        このページは<a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>の下に公開されます。<br />
      </footer>
    </div>
  );
}

export default App;