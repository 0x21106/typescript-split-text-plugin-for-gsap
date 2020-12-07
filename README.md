## Usage

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```typescript
import SplitText, { ISplitText } from "../split-textv2";


const splittedTitle = new SplitText("#loading-title", {
    types: ["chars", "words", "lines"],
});

```

## Options

Option | Default Value
- | -
types | ["lines", "words", "chars"]
lineClass | hella-line
wordClass | hella-word
charClass | hella-char

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
