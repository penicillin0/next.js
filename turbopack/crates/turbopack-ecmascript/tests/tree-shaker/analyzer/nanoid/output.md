# Items

Count: 19

## Item 1: Stmt 0, `ImportOfModule`

```js
import crypto from 'crypto';

```

- Hoisted
- Side effects

## Item 2: Stmt 0, `ImportBinding(0)`

```js
import crypto from 'crypto';

```

- Hoisted
- Declares: `crypto`

## Item 3: Stmt 1, `ImportOfModule`

```js
import { urlAlphabet } from './url-alphabet/index.js';

```

- Hoisted
- Side effects

## Item 4: Stmt 1, `ImportBinding(0)`

```js
import { urlAlphabet } from './url-alphabet/index.js';

```

- Hoisted
- Declares: `urlAlphabet`

## Item 5: Stmt 2, `VarDeclarator(0)`

```js
const POOL_SIZE_MULTIPLIER = 128;

```

- Declares: `POOL_SIZE_MULTIPLIER`
- Write: `POOL_SIZE_MULTIPLIER`

## Item 6: Stmt 3, `VarDeclarator(0)`

```js
let pool, poolOffset;

```

- Declares: `pool`
- Write: `pool`

## Item 7: Stmt 3, `VarDeclarator(1)`

```js
let pool, poolOffset;

```

- Declares: `poolOffset`
- Write: `poolOffset`

## Item 8: Stmt 4, `VarDeclarator(0)`

```js
let fillPool = (bytes)=>{
    if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        crypto.randomFillSync(pool);
        poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
        crypto.randomFillSync(pool);
        poolOffset = 0;
    }
    poolOffset += bytes;
};

```

- Side effects
- Declares: `fillPool`
- Reads: `pool`, `POOL_SIZE_MULTIPLIER`, `crypto`, `poolOffset`
- Write: `pool`, `crypto`, `poolOffset`, `fillPool`

## Item 9: Stmt 5, `VarDeclarator(0)`

```js
let random = (bytes)=>{
    fillPool((bytes -= 0));
    return pool.subarray(poolOffset - bytes, poolOffset);
};

```

- Declares: `random`
- Reads: `fillPool`, `pool`, `poolOffset`
- Write: `pool`, `random`

## Item 10: Stmt 6, `VarDeclarator(0)`

```js
let customRandom = (alphabet, size, getRandom)=>{
    let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
    let step = Math.ceil((1.6 * mask * size) / alphabet.length);
    return ()=>{
        let id = '';
        while(true){
            let bytes = getRandom(step);
            let i = step;
            while(i--){
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === size) return id;
            }
        }
    };
};

```

- Side effects
- Declares: `customRandom`
- Write: `customRandom`

## Item 11: Stmt 7, `VarDeclarator(0)`

```js
let customAlphabet = (alphabet, size)=>customRandom(alphabet, size, random);

```

- Declares: `customAlphabet`
- Reads: `customRandom`, `random`
- Write: `customAlphabet`

## Item 12: Stmt 8, `VarDeclarator(0)`

```js
let nanoid = (size = 21)=>{
    fillPool((size -= 0));
    let id = '';
    for(let i = poolOffset - size; i < poolOffset; i++){
        id += urlAlphabet[pool[i] & 63];
    }
    return id;
};

```

- Declares: `nanoid`
- Reads: `fillPool`, `poolOffset`, `urlAlphabet`, `pool`
- Write: `urlAlphabet`, `pool`, `nanoid`

## Item 13: Stmt 9, `ImportBinding(3)`

```js
export { nanoid, customAlphabet, customRandom, urlAlphabet, random };

```

- Hoisted
- Declares: `urlAlphabet`

# Phase 1
```mermaid
graph TD
    Item1;
    Item3;
    Item2;
    Item4;
    Item5;
    Item6;
    Item7;
    Item8;
    Item9;
    Item10;
    Item11;
    Item12;
    Item13;
    Item14;
    Item14["ModuleEvaluation"];
    Item15;
    Item15["export nanoid"];
    Item16;
    Item16["export customAlphabet"];
    Item17;
    Item17["export customRandom"];
    Item18;
    Item18["export urlAlphabet"];
    Item19;
    Item19["export random"];
    Item2 --> Item1;
```
# Phase 2
```mermaid
graph TD
    Item1;
    Item3;
    Item2;
    Item4;
    Item5;
    Item6;
    Item7;
    Item8;
    Item9;
    Item10;
    Item11;
    Item12;
    Item13;
    Item14;
    Item14["ModuleEvaluation"];
    Item15;
    Item15["export nanoid"];
    Item16;
    Item16["export customAlphabet"];
    Item17;
    Item17["export customRandom"];
    Item18;
    Item18["export urlAlphabet"];
    Item19;
    Item19["export random"];
    Item2 --> Item1;
    Item8 --> Item6;
    Item8 --> Item5;
    Item8 --> Item3;
    Item8 --> Item7;
    Item8 --> Item1;
    Item8 --> Item2;
    Item9 --> Item8;
    Item9 --> Item6;
    Item9 --> Item7;
    Item10 --> Item1;
    Item10 --> Item2;
    Item10 --> Item8;
    Item11 --> Item10;
    Item11 --> Item9;
    Item12 --> Item8;
    Item12 --> Item7;
    Item12 --> Item4;
    Item12 --> Item13;
    Item12 --> Item9;
    Item12 --> Item6;
    Item15 --> Item12;
    Item16 --> Item11;
    Item17 --> Item10;
    Item18 --> Item12;
    Item18 --> Item4;
    Item19 --> Item9;
```
# Phase 3
```mermaid
graph TD
    Item1;
    Item3;
    Item2;
    Item4;
    Item5;
    Item6;
    Item7;
    Item8;
    Item9;
    Item10;
    Item11;
    Item12;
    Item13;
    Item14;
    Item14["ModuleEvaluation"];
    Item15;
    Item15["export nanoid"];
    Item16;
    Item16["export customAlphabet"];
    Item17;
    Item17["export customRandom"];
    Item18;
    Item18["export urlAlphabet"];
    Item19;
    Item19["export random"];
    Item2 --> Item1;
    Item8 --> Item6;
    Item8 --> Item5;
    Item8 --> Item3;
    Item8 --> Item7;
    Item8 --> Item1;
    Item8 --> Item2;
    Item9 --> Item8;
    Item9 --> Item6;
    Item9 --> Item7;
    Item10 --> Item1;
    Item10 --> Item2;
    Item10 --> Item8;
    Item11 --> Item10;
    Item11 --> Item9;
    Item12 --> Item8;
    Item12 --> Item7;
    Item12 --> Item4;
    Item12 --> Item13;
    Item12 --> Item9;
    Item12 --> Item6;
    Item15 --> Item12;
    Item16 --> Item11;
    Item17 --> Item10;
    Item18 --> Item12;
    Item18 --> Item4;
    Item19 --> Item9;
```
# Phase 4
```mermaid
graph TD
    Item1;
    Item3;
    Item2;
    Item4;
    Item5;
    Item6;
    Item7;
    Item8;
    Item9;
    Item10;
    Item11;
    Item12;
    Item13;
    Item14;
    Item14["ModuleEvaluation"];
    Item15;
    Item15["export nanoid"];
    Item16;
    Item16["export customAlphabet"];
    Item17;
    Item17["export customRandom"];
    Item18;
    Item18["export urlAlphabet"];
    Item19;
    Item19["export random"];
    Item2 --> Item1;
    Item8 --> Item6;
    Item8 --> Item5;
    Item8 --> Item3;
    Item8 --> Item7;
    Item8 --> Item1;
    Item8 --> Item2;
    Item9 --> Item8;
    Item9 --> Item6;
    Item9 --> Item7;
    Item10 --> Item1;
    Item10 --> Item2;
    Item10 --> Item8;
    Item11 --> Item10;
    Item11 --> Item9;
    Item12 --> Item8;
    Item12 --> Item7;
    Item12 --> Item4;
    Item12 --> Item13;
    Item12 --> Item9;
    Item12 --> Item6;
    Item15 --> Item12;
    Item16 --> Item11;
    Item17 --> Item10;
    Item18 --> Item12;
    Item18 --> Item4;
    Item19 --> Item9;
    Item14 --> Item1;
    Item14 --> Item2;
    Item14 --> Item8;
    Item14 --> Item10;
```
# Final
```mermaid
graph TD
    N0["Items: [ItemId(9, ImportBinding(3))]"];
    N1["Items: [ItemId(1, ImportBinding(0))]"];
    N2["Items: [ItemId(3, VarDeclarator(1))]"];
    N3["Items: [ItemId(0, ImportBinding(0))]"];
    N4["Items: [ItemId(2, VarDeclarator(0))]"];
    N5["Items: [ItemId(3, VarDeclarator(0))]"];
    N6["Items: [ItemId(0, ImportOfModule)]"];
    N7["Items: [ItemId(1, ImportOfModule)]"];
    N8["Items: [ItemId(4, VarDeclarator(0))]"];
    N9["Items: [ItemId(6, VarDeclarator(0))]"];
    N10["Items: [ItemId(ModuleEvaluation)]"];
    N11["Items: [ItemId(Export((&quot;customRandom&quot;, #2), &quot;customRandom&quot;))]"];
    N12["Items: [ItemId(5, VarDeclarator(0))]"];
    N13["Items: [ItemId(Export((&quot;random&quot;, #2), &quot;random&quot;))]"];
    N14["Items: [ItemId(8, VarDeclarator(0))]"];
    N15["Items: [ItemId(Export((&quot;urlAlphabet&quot;, #2), &quot;urlAlphabet&quot;))]"];
    N16["Items: [ItemId(Export((&quot;nanoid&quot;, #2), &quot;nanoid&quot;))]"];
    N17["Items: [ItemId(7, VarDeclarator(0))]"];
    N18["Items: [ItemId(Export((&quot;customAlphabet&quot;, #2), &quot;customAlphabet&quot;))]"];
    N7 --> N6;
    N8 --> N5;
    N8 --> N4;
    N8 --> N3;
    N8 --> N2;
    N8 --> N6;
    N8 --> N7;
    N12 --> N8;
    N12 --> N5;
    N12 --> N2;
    N9 --> N6;
    N9 --> N7;
    N9 --> N8;
    N17 --> N9;
    N17 --> N12;
    N14 --> N8;
    N14 --> N2;
    N14 --> N1;
    N14 --> N0;
    N14 --> N12;
    N14 --> N5;
    N16 --> N14;
    N18 --> N17;
    N11 --> N9;
    N15 --> N14;
    N15 --> N1;
    N13 --> N12;
    N10 --> N6;
    N10 --> N7;
    N10 --> N8;
    N10 --> N9;
```
# Entrypoints

```
{
    ModuleEvaluation: 10,
    Exports: 19,
    Export(
        "customRandom",
    ): 11,
    Export(
        "urlAlphabet",
    ): 15,
    Export(
        "random",
    ): 13,
    Export(
        "customAlphabet",
    ): 18,
    Export(
        "nanoid",
    ): 16,
}
```


# Modules (dev)
## Part 0
```js
import { urlAlphabet as urlAlphabet } from './url-alphabet/index.js';
export { urlAlphabet as a } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 1
```js
import { urlAlphabet } from './url-alphabet/index.js';
export { urlAlphabet as a } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 2
```js
let poolOffset;
export { poolOffset as b } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 3
```js
import crypto from 'crypto';
export { crypto as c } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 4
```js
const POOL_SIZE_MULTIPLIER = 128;
export { POOL_SIZE_MULTIPLIER as d } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 5
```js
let pool;
export { pool as e } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 6
```js
import 'crypto';

```
## Part 7
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import './url-alphabet/index.js';

```
## Part 8
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 4
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 3
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { d as POOL_SIZE_MULTIPLIER } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 4
};
import { c as crypto } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 3
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
let fillPool = (bytes)=>{
    if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        crypto.randomFillSync(pool);
        poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
        crypto.randomFillSync(pool);
        poolOffset = 0;
    }
    poolOffset += bytes;
};
export { fillPool as f } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 9
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
let customRandom = (alphabet, size, getRandom)=>{
    let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
    let step = Math.ceil((1.6 * mask * size) / alphabet.length);
    return ()=>{
        let id = '';
        while(true){
            let bytes = getRandom(step);
            let i = step;
            while(i--){
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === size) return id;
            }
        }
    };
};
export { customRandom as g } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 10
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
"module evaluation";

```
## Part 11
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import { g as customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
export { customRandom };

```
## Part 12
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import { f as fillPool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
let random = (bytes)=>{
    fillPool((bytes -= 0));
    return pool.subarray(poolOffset - bytes, poolOffset);
};
export { random as h } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 13
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import { h as random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
export { random };

```
## Part 14
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 1
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { f as fillPool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import { a as urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
let nanoid = (size = 21)=>{
    fillPool((size -= 0));
    let id = '';
    for(let i = poolOffset - size; i < poolOffset; i++){
        id += urlAlphabet[pool[i] & 63];
    }
    return id;
};
export { nanoid as i } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 15
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 1
};
import { a as urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
export { urlAlphabet };

```
## Part 16
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
import { i as nanoid } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
export { nanoid };

```
## Part 17
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import { g as customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import { h as random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
let customAlphabet = (alphabet, size)=>customRandom(alphabet, size, random);
export { customAlphabet as j } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 18
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 17
};
import { j as customAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 17
};
export { customAlphabet };

```
## Part 19
```js
export { customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export customRandom"
};
export { random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export random"
};
export { urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export urlAlphabet"
};
export { nanoid } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export nanoid"
};
export { customAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export customAlphabet"
};

```
## Merged (module eval)
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
"module evaluation";

```
# Entrypoints

```
{
    ModuleEvaluation: 10,
    Exports: 19,
    Export(
        "customRandom",
    ): 11,
    Export(
        "urlAlphabet",
    ): 15,
    Export(
        "random",
    ): 13,
    Export(
        "customAlphabet",
    ): 18,
    Export(
        "nanoid",
    ): 16,
}
```


# Modules (prod)
## Part 0
```js
import { urlAlphabet as urlAlphabet } from './url-alphabet/index.js';
export { urlAlphabet as a } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 1
```js
import { urlAlphabet } from './url-alphabet/index.js';
export { urlAlphabet as a } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 2
```js
let poolOffset;
export { poolOffset as b } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 3
```js
import crypto from 'crypto';
export { crypto as c } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 4
```js
const POOL_SIZE_MULTIPLIER = 128;
export { POOL_SIZE_MULTIPLIER as d } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 5
```js
let pool;
export { pool as e } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 6
```js
import 'crypto';

```
## Part 7
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import './url-alphabet/index.js';

```
## Part 8
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 4
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 3
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { d as POOL_SIZE_MULTIPLIER } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 4
};
import { c as crypto } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 3
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
let fillPool = (bytes)=>{
    if (!pool || pool.length < bytes) {
        pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER);
        crypto.randomFillSync(pool);
        poolOffset = 0;
    } else if (poolOffset + bytes > pool.length) {
        crypto.randomFillSync(pool);
        poolOffset = 0;
    }
    poolOffset += bytes;
};
export { fillPool as f } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 9
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
let customRandom = (alphabet, size, getRandom)=>{
    let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1;
    let step = Math.ceil((1.6 * mask * size) / alphabet.length);
    return ()=>{
        let id = '';
        while(true){
            let bytes = getRandom(step);
            let i = step;
            while(i--){
                id += alphabet[bytes[i] & mask] || '';
                if (id.length === size) return id;
            }
        }
    };
};
export { customRandom as g } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 10
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
"module evaluation";

```
## Part 11
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import { g as customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
export { customRandom };

```
## Part 12
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import { f as fillPool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
let random = (bytes)=>{
    fillPool((bytes -= 0));
    return pool.subarray(poolOffset - bytes, poolOffset);
};
export { random as h } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 13
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import { h as random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
export { random };

```
## Part 14
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 1
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
import { f as fillPool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import { b as poolOffset } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 2
};
import { a as urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
import { e as pool } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 5
};
let nanoid = (size = 21)=>{
    fillPool((size -= 0));
    let id = '';
    for(let i = poolOffset - size; i < poolOffset; i++){
        id += urlAlphabet[pool[i] & 63];
    }
    return id;
};
export { nanoid as i } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 15
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 1
};
import { a as urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 0
};
export { urlAlphabet };

```
## Part 16
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
import { i as nanoid } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 14
};
export { nanoid };

```
## Part 17
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
import { g as customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
import { h as random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 12
};
let customAlphabet = (alphabet, size)=>customRandom(alphabet, size, random);
export { customAlphabet as j } from "__TURBOPACK_VAR__" assert {
    __turbopack_var__: true
};

```
## Part 18
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 17
};
import { j as customAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: 17
};
export { customAlphabet };

```
## Part 19
```js
export { customRandom } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export customRandom"
};
export { random } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export random"
};
export { urlAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export urlAlphabet"
};
export { nanoid } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export nanoid"
};
export { customAlphabet } from "__TURBOPACK_PART__" assert {
    __turbopack_part__: "export customAlphabet"
};

```
## Merged (module eval)
```js
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 6
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 7
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 8
};
import "__TURBOPACK_PART__" assert {
    __turbopack_part__: 9
};
"module evaluation";

```
