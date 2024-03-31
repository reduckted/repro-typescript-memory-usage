Reproduction for TypeScript memory usage issue.

```
node run.js
```

This repository:

```
v5.3.3:

Files:                        1605
Lines of Library:            37748
Lines of Definitions:       179721
Lines of TypeScript:         82545
Lines of JavaScript:             0
Lines of JSON:                   0
Lines of Other:                  0

Memory before: 20 MB
Memory after:  525 MB

v5.4.3:

Files:                        1606
Lines of Library:            38041
Lines of Definitions:       179786
Lines of TypeScript:         82545
Lines of JavaScript:             0
Lines of JSON:                   0
Lines of Other:                  0

Memory before: 20 MB
Memory after:  775 MB
```

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
