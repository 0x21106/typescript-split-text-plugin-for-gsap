type IPropTargets = string;
type ITargets = HTMLElement[];

export interface ISplitText {
    types:string[],
    lines: Element[],
    words: Element[],
    chars: Element[],
}

type IOptions = {
  types: string[];
  lineClass?: string;
  wordClass?: string;
  charClass?: string;
};

type ILines = Element[];

const initialOptions = {
  types: ["lines", "words", "chars"],
  lineClass: "hella-line",
  wordClass: "hella-word",
  charClass: "hella-char",
};

const _types = {
  lines: "lines",
  words: "words",
  chars: "chars",
};

class SplitText implements IOptions {
  targets: ITargets;
  options: IOptions;

  lines: ILines = [];
  words: Element[] = [];
  chars: Element[] = [];

  constructor(targets: IPropTargets, options: IOptions = initialOptions) {
    const _target: HTMLElement[] = Array.prototype.slice.call(
      document.querySelectorAll(targets)
    ) as HTMLElement[];
    if (_target) {
      this.targets = _target;
    } else {
      throw new Error(`Target not found!\n${targets}`);
    }
    this.options = options;
    this.init();
  }

  get types() {
    return this.options.types;
  }

  searchTextNode(element: Element) {
    let textNodes: Node[] = [];

    element.childNodes.forEach((node: Node) => {
      if (node.nodeName === "#text") {
        if (node.textContent !== " ") {
          textNodes.push(node);
        }
      } else {
        textNodes = textNodes.concat(this.searchTextNode(node as Element));
      }
    });
    return textNodes;
  }

  async splitLines(target: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const inner = target.innerHTML;
        const words = target.innerHTML.split(" ");
        const splitPoints: number[] = [];
        target.innerHTML = "";
        let offsetHeight = target.offsetHeight;
        words.forEach((word: string, index: number) => {
          target.innerHTML += `${word} `;
          if (target.offsetHeight > offsetHeight) {
            offsetHeight = target.offsetHeight;
            splitPoints.push(
              target.innerHTML.length - (words[index].length + 1)
            );
          }
        });

        splitPoints.push(target.innerHTML.length);
        target.innerHTML = "";

        for (let i = 0; i < splitPoints.length; i += 2) {
          const startPoint = splitPoints[i];
          const endPoint = splitPoints[i + 1];
          if (inner.substring(startPoint, endPoint).length !== 0) {
            const div = document.createElement("div");
            div.style.display = "block";
            div.classList.add(
              this.options.lineClass ?? initialOptions.lineClass
            );
            div.innerHTML = inner.substring(startPoint, endPoint);
            target.appendChild(div);
            this.lines.push(div);
          }
        }

        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  async splitWords(target: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const nodes: string[] = [];
        const textNodes = this.searchTextNode(target);
        target.innerHTML = "";

        textNodes.forEach((node: Node) => {
          node.nodeValue
            ?.split(" ")
            .join(" @whyAreYouGay?@")
            .split("@whyAreYouGay?@")
            .forEach((word: string) => {
              if (word.slice(-1) === " ") {
                nodes.push(word.trim());
                nodes.push(" ");
              } else {
                nodes.push(word.trim());
              }
            });
        });

        nodes.forEach((word: string) => {
          if (word.slice(-1) === " ") {
            target.insertAdjacentText("beforeend", " ");
          } else {
            if (word.length !== 0) {
              const div: HTMLElement = document.createElement("div");
              const text: string = word;
              div.classList.add(
                this.options.wordClass ?? initialOptions.wordClass
              );
              div.innerHTML = text;

              div.style.position = "relative";
              div.style.display = "inline-block";

              this.words.push(div);
              target.appendChild(div);
            }
          }
        });
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }

  splitChars(target: HTMLElement): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const nodes: Element[] = [];
        const textNodes = this.searchTextNode(target);
        target.innerHTML = "";

        textNodes.forEach((node: Node) => {
          const splittedChars = node.textContent?.split("");
          splittedChars?.forEach((char: string) => {
            const div = document.createElement("div");
            const text: string = char;

            div.classList.add(
              this.options.charClass ?? initialOptions.charClass
            );

            div.style.position = "relative";
            div.style.display = "inline-block";

            div.innerHTML = text;
            this.chars.push(div);
            nodes.push(div);
          });

          nodes.forEach((charNode: Element) => {
            if (charNode.textContent?.slice(-1) === " ") {
              target.insertAdjacentText("beforeend", " ");
            } else {
              target.appendChild(charNode);
            }
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  init() {
    this.targets.forEach(async (target: HTMLElement) => {
      if (this.types.includes(_types.lines)) {
        await this.splitLines(target).catch((error) => {
          throw new Error(error.message);
        });
      }
      if (this.types.includes(_types.words)) {
        const lines = target.querySelectorAll(
          `.${this.options.lineClass ?? initialOptions.lineClass}`
        );
        if (lines.length > 0) {
          lines.forEach(async (line: Element) => {
            await this.splitWords(line as HTMLElement).catch((error) => {
              throw new Error(error.message);
            });
          });
        } else {
          await this.splitWords(target).catch((error) => {
            throw new Error(error.message);
          });
        }
      }
      if (this.types.includes(_types.chars)) {
        if (this.words.length > 0) {
          this.words.forEach(async (word: Element) => {
            await this.splitChars(word as HTMLElement).catch((error) => {
              throw new Error(error.message);
            });
          });
        } else if (this.lines.length > 0) {
          this.lines.forEach(async (line: Element) => {
            await this.splitChars(line as HTMLElement).catch((error) => {
              throw new Error(error.message);
            });
          });
        } else {
          await this.splitChars(target).catch((error) => {
            throw new Error(error.message);
          });
        }
      }
    });
  }
}

export default SplitText;
