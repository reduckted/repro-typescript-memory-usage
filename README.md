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

| Property                  |   v5.3.3 |   v5.4.5 |     Diff | Diff % |
| ------------------------- | -------: | -------: | -------: | -----: |
| Files                     |     8823 |     9330 |     +507 |   5.7% |
| Lines of Library          |    37748 |    38041 |     +293 |   0.7% |
| Lines of Definitions      |   204088 |   329819 |  +125731 |  61.6% |
| Lines of TypeScript       |  1126416 |  1126416 |        0 |     0% |
| Lines of JavaScript       |      276 |     1761 |    +1485 | 538.0% |
| Lines of JSON             |        0 |        0 |        0 |     0% |
| Lines of Other            |        0 |        0 |        0 |     0% |
| Identifiers               |  1640769 |  1771163 |  +130394 |   7.9% |
| Symbols                   |  2081369 |  2140374 |   +59005 |   2.8% |
| Types                     |   567044 |   574305 |    +7261 |   1.2% |
| Instantiations            |  2186559 |  2229199 |   +42640 |   1.9% |
| Memory used               | 2338983K | 8332631K | +5993648 | 256.2% |
| Assignability cache size  |   268459 |   271481 |    +3022 |   1.1% |
| Identity cache size       |    16564 |    16580 |      +16 |  0.09% |
| Subtype cache size        |    45773 |    45812 |      +39 |  0.08% |
| Strict subtype cache size |    87667 |    87687 |      +20 |  0.02% |
| I/O Read time             |    7.63s |    6.19s |    -1.44 | -18.8% |
| Parse time                |    5.68s |    6.08s |     +0.4 |   7.0% |
| ResolveModule time        |    3.00s |    3.37s |    +0.37 |  12.3% |
| ResolveLibrary time       |    0.03s |    0.04s |    +0.01 |  33.3% |
| ResolveTypeReference time |    0.03s |    0.04s |    +0.01 |  33.3% |
| Program time              |   25.59s |  140.48s |  +114.89 | 448.9% |
| Bind time                 |    2.49s |    3.23s |    +0.74 |  29.7% |
| Check time                |   47.07s |   55.12s |    +8.05 |  17.1% |
| printTime time            |    0.00s |    0.00s |        0 |     0% |
| Emit time                 |    0.00s |    0.00s |        0 |     0% |
| Total time                |   75.15s |  198.84s |   123.69 | 164.4% |
