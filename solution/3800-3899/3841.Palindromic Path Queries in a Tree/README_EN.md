---
comments: true
difficulty: Hard
rating: 2384
source: Biweekly Contest 176 Q4
tags:
    - Bit Manipulation
    - Tree
    - Depth-First Search
    - Binary Indexed Tree
    - Segment Tree
    - Array
    - String
    - Divide and Conquer
---

<!-- problem:start -->

# [3841. Palindromic Path Queries in a Tree](https://leetcode.com/problems/palindromic-path-queries-in-a-tree)

[中文文档](/solution/3800-3899/3841.Palindromic%20Path%20Queries%20in%20a%20Tree/README.md)

## Description

<!-- description:start -->

<p>You are given an undirected tree with <code>n</code> nodes labeled 0 to <code>n - 1</code>. This is represented by a 2D array <code>edges</code> of length <code>n - 1</code>, where <code>edges[i] = [u<sub>i</sub>, v<sub>i</sub>]</code> indicates an undirected edge between nodes <code>u<sub>i</sub></code> and <code>v<sub>i</sub></code>.</p>

<p>You are also given a string <code>s</code> of length <code>n</code> consisting of lowercase English letters, where <code>s[i]</code> represents the character assigned to node <code>i</code>.</p>

<p>You are also given a string array <code>queries</code>, where each <code>queries[i]</code> is either:</p>

<ul>
	<li><code>&quot;update u<sub>i</sub> c&quot;</code>: Change the character at node <code>u<sub>i</sub></code> to <code>c</code>. Formally, update <code>s[u<sub>i</sub>] = c</code>.</li>
	<li><code>&quot;query u<sub>i</sub> v<sub>i</sub>&quot;</code>: Determine whether the string formed by the characters on the <strong>unique</strong> path from <code>u<sub>i</sub></code> to <code>v<sub>i</sub></code> (inclusive) can be <strong>rearranged</strong> into a <strong><span data-keyword="palindrome-string">palindrome</span></strong>.</li>
</ul>

<p>Return a boolean array <code>answer</code>, where <code>answer[j]</code> is <code>true</code> if the <code>j<sup>th</sup></code> query of type <code>&quot;query u<sub>i</sub> v<sub>i</sub>&quot;​​​​​​​</code> can be rearranged into a <strong>palindrome</strong>, and <code>false</code> otherwise.</p>

<p>&nbsp;</p>
<p><strong class="example">Example 1:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 3, edges = [[0,1],[1,2]], s = &quot;aac&quot;, queries = [&quot;query 0 2&quot;,&quot;update 1 b&quot;,&quot;query 0 2&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[true,false]</span></p>

<p><strong>Explanation:</strong></p>

<ul>
	<li><code>&quot;query 0 2&quot;</code>: Path <code>0 &rarr; 1 &rarr; 2</code> gives <code>&quot;aac&quot;</code>, which can be rearranged to form <code>&quot;aca&quot;</code>, a palindrome. Thus, <code>answer[0] = true</code>.</li>
	<li><code>&quot;update 1 b&quot;</code>: Update node 1 to <code>&#39;b&#39;</code>, now <code>s = &quot;abc&quot;</code>.</li>
	<li><code>&quot;query 0 2&quot;</code>: Path characters are <code>&quot;abc&quot;</code>, which cannot be rearranged to form a palindrome. Thus, <code>answer[1] = false</code>.</li>
</ul>

<p>Thus, <code>answer = [true, false]</code>.</p>
</div>

<p><strong class="example">Example 2:</strong></p>

<div class="example-block">
<p><strong>Input:</strong> <span class="example-io">n = 4, edges = [[0,1],[0,2],[0,3]], s = &quot;abca&quot;, queries = [&quot;query 1 2&quot;,&quot;update 0 b&quot;,&quot;query 2 3&quot;,&quot;update 3 a&quot;,&quot;query 1 3&quot;]</span></p>

<p><strong>Output:</strong> <span class="example-io">[false,false,true]</span></p>

<p><strong>Explanation:</strong></p>

<ul>
	<li><code>&quot;query 1 2&quot;</code>: Path <code>1 &rarr; 0 &rarr; 2</code> gives <code>&quot;bac&quot;</code>, which cannot be rearranged to form a palindrome. Thus, <code>answer[0] = false</code>.</li>
	<li><code>&quot;update 0 b&quot;</code>: Update node 0 to <code>&#39;b&#39;</code>, now <code>s = &quot;bbca&quot;</code>.</li>
	<li><code>&quot;query 2 3&quot;</code>: Path <code>2 &rarr; 0 &rarr; 3</code> gives <code>&quot;cba&quot;</code>, which cannot be rearranged to form a palindrome. Thus, <code>answer[1] = false</code>.</li>
	<li><code>&quot;update 3 a&quot;</code>: Update node 3 to <code>&#39;a&#39;</code>, <code>s = &quot;bbca&quot;</code>.</li>
	<li><code>&quot;query 1 3&quot;</code>: Path <code>1 &rarr; 0 &rarr; 3</code> gives <code>&quot;bba&quot;</code>, which can be rearranged to form <code>&quot;bab&quot;</code>, a palindrome. Thus, <code>answer[2] = true</code>.</li>
</ul>

<p>Thus, <code>answer = [false, false, true]</code>.</p>
</div>

<p>&nbsp;</p>
<p><strong>Constraints:</strong></p>

<ul>
	<li><code>1 &lt;= n == s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>edges.length == n - 1</code></li>
	<li><code>edges[i] = [u<sub>i</sub>, v<sub>i</sub>]</code></li>
	<li><code>0 &lt;= u<sub>i</sub>, v<sub>i</sub> &lt;= n - 1</code></li>
	<li><code>s</code> consists of lowercase English letters.</li>
	<li>The input is generated such that <code>edges</code> represents a valid tree.</li>
	<li><code>1 &lt;= queries.length &lt;= 5 * 10<sup>4</sup></code>​​​​​​​
	<ul>
		<li><code>queries[i] = &quot;update u<sub>i</sub> c&quot;</code> or</li>
		<li><code>queries[i] = &quot;query u<sub>i</sub> v<sub>i</sub>&quot;</code></li>
		<li><code>0 &lt;= u<sub>i</sub>, v<sub>i</sub> &lt;= n - 1</code></li>
		<li><code>c</code> is a lowercase English letter.</li>
	</ul>
	</li>
</ul>

<!-- description:end -->

## Solutions

<!-- solution:start -->

### Solution 1

<!-- thinking:start -->

> **Thinking**
>
> A path can be rearranged into a palindrome iff at most one character has odd frequency. $n,q \le 5 \times 10^4$ forbids walking each path.
>
> Parity of letter counts is a $26$-bit mask. The path mask is the XOR of the two rootward prefixes, cancelling the LCA.
>
> Updating a node's character changes rootward masks in a structured way, which a tree difference or Euler-tour structure can maintain.
>
> A query fetches the LCA and checks that the path mask has at most one bit set; an update rewrites the character and the masks.

<!-- thinking:end -->
<!-- tabs:start -->

#### Python3

```python

```

#### Java

```java

```

#### C++

```cpp

```

#### Go

```go

```

### TypeScript

```ts
function palindromePath(n: number, edges: number[][], s: string, queries: string[]): boolean[] {
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    let LOG = 1;
    while ((1 << LOG) < n) LOG++;

    const tin = new Int32Array(n);
    const tout = new Int32Array(n);
    const dep = new Int32Array(n);
    const pfx = new Int32Array(n);
    const up: Int32Array[] = Array.from({length: LOG}, () => new Int32Array(n));
    const sc = s.split('');

    // Iterative DFS for Euler tour, depths, prefix XOR, parents
    let timer = 0;
    const stk: [number, number, boolean][] = [[0, -1, false]];
    while (stk.length > 0) {
        const [v, p, done] = stk.pop()!;
        if (done) { tout[v] = timer - 1; continue; }
        tin[v] = timer++;
        up[0][v] = p < 0 ? v : p;
        dep[v] = p < 0 ? 0 : dep[p] + 1;
        pfx[v] = (p < 0 ? 0 : pfx[p]) ^ (1 << (sc[v].charCodeAt(0) - 97));
        stk.push([v, p, true]);
        for (const u of adj[v]) {
            if (u !== p) stk.push([u, v, false]);
        }
    }

    // Binary lifting table for LCA
    for (let k = 1; k < LOG; k++) {
        for (let v = 0; v < n; v++) {
            up[k][v] = up[k - 1][up[k - 1][v]];
        }
    }

    function lca(u: number, v: number): number {
        if (dep[u] < dep[v]) { const t = u; u = v; v = t; }
        let d = dep[u] - dep[v];
        for (let k = 0; k < LOG; k++) {
            if ((d >> k) & 1) u = up[k][u];
        }
        if (u === v) return u;
        for (let k = LOG - 1; k >= 0; k--) {
            if (up[k][u] !== up[k][v]) { u = up[k][u]; v = up[k][v]; }
        }
        return up[0][u];
    }

    // BIT with XOR: range update on subtrees, point query for prefix
    const bit = new Int32Array(n + 2);
    function bitUpd(i: number, val: number): void {
        for (i++; i <= n; i += i & -i) bit[i] ^= val;
    }
    function bitQry(i: number): number {
        let r = 0;
        for (i++; i > 0; i -= i & -i) r ^= bit[i];
        return r;
    }

    const ans: boolean[] = [];
    for (const q of queries) {
        const parts = q.split(' ');
        if (parts[0] === 'update') {
            const u = parseInt(parts[1]);
            const c = parts[2];
            const delta = (1 << (sc[u].charCodeAt(0) - 97)) ^ (1 << (c.charCodeAt(0) - 97));
            if (delta !== 0) {
                bitUpd(tin[u], delta);
                if (tout[u] + 1 < n) bitUpd(tout[u] + 1, delta);
            }
            sc[u] = c;
        } else {
            const u = parseInt(parts[1]);
            const v = parseInt(parts[2]);
            const l = lca(u, v);
            // Current effective prefix = original prefix ^ accumulated BIT delta
            const mask = (pfx[u] ^ bitQry(tin[u]))
                       ^ (pfx[v] ^ bitQry(tin[v]))
                       ^ (1 << (sc[l].charCodeAt(0) - 97));
            // At most 1 bit set ⟹ can form palindrome
            ans.push((mask & (mask - 1)) === 0);
        }
    }
    return ans;
}
```

<!-- tabs:end -->

<!-- solution:end -->

<!-- problem:end -->
