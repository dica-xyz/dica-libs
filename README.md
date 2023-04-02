# @dica/libs

> DICA libraries provides ui components, apis and utilities for dica front-end project [dica-ui](https://github.com/dica-xyz/dica-ui). It is also used for developing customized plug-in components, [dica-plugins](https://github.com/dica-xyz/dica-plugins).

## Install

```bash
npm install --save @dica/libs
```

## Usage

```jsx
import React from "react";

import { components, apis, icons, utils } from "@dica/libs";
import "@dica/libs/lib/dica.css";

const { Input } = components;
const Example = (props)=> {
  render() {
    return <Input />;
  }
};
```

## License

MIT © [dica.xyz](https://github.com/dica-xyz)
