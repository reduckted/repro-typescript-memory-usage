Reproduction for TypeScript memory usage issue.

```
node run.js
```

This repository:

| Property                  |  v5.3.3 |  v5.4.5 |
| ------------------------- | ------: | ------: |
| Files                     |    1608 |    1687 |
| Lines of Library          |   37748 |   38041 |
| Lines of Definitions      |  179721 |  210173 |
| Lines of TypeScript       |   82545 |   82545 |
| Lines of JavaScript       |      48 |      95 |
| Lines of JSON             |       0 |       0 |
| Lines of Other            |       0 |       0 |
| Identifiers               |  338245 |  365499 |
| Symbols                   |  368926 |  695367 |
| Types                     |  163227 |  290657 |
| Instantiations            |  242137 |  835175 |
| Memory used               | 568787K | 827934K |
| Assignability cache size  |  233595 |  251268 |
| Identity cache size       |     555 |    2555 |
| Subtype cache size        |    1597 |    1614 |
| Strict subtype cache size |   16531 |   17068 |
| I/O Read time             |   0.27s |   0.32s |
| Parse time                |   2.23s |   2.63s |
| ResolveModule time        |   0.74s |   0.89s |
| ResolveLibrary time       |   0.05s |   0.06s |
| ResolveTypeReference time |   0.09s |   0.09s |
| Program time              |   4.92s |   5.76s |
| Bind time                 |   0.90s |   1.17s |
| Check time                |  12.56s |  17.90s |
| printTime time            |   0.00s |   0.00s |
| Emit time                 |   0.00s |   0.00s |
| Total time                |  18.38s |  24.83s |

---

Large Project:

```
v5.3.3:

Files:                6726
Lines of Library:     37748
Lines of Definitions: 200580
Lines of TypeScript:  468949
Lines of JavaScript:  0
Lines of JSON:        0
Lines of Other:       0

Memory before: 20 MB
Memory after:  1313 MB

v5.4.3:

Files:                6727
Lines of Library:     38041
Lines of Definitions: 200580
Lines of TypeScript:  468949
Lines of JavaScript:  0
Lines of JSON:        0
Lines of Other:       0

Memory before: 20 MB
Memory after:  3532 MB
```

---

Even Larger Project:

```
v5.3.3:

Files:                8800
Lines of Library:     37748
Lines of Definitions: 202172
Lines of TypeScript:  1118038
Lines of JavaScript:  0
Lines of JSON:        0
Lines of Other:       0

Memory before: 20 MB
Memory after:  2254 MB

v5.4.3:

Files:                8801
Lines of Library:     38041
Lines of Definitions: 202172
Lines of TypeScript:  1118038
Lines of JavaScript:  0
Lines of JSON:        0
Lines of Other:       0

Memory before: 20 MB
Memory after:  8180 MB
```
