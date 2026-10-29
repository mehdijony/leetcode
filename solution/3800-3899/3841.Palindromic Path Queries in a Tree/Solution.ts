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