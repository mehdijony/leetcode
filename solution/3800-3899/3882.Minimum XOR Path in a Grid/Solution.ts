function minCost(grid: number[][]): number {
    const m = grid.length;
    const n = grid[0].length;
    const XOR_MAX = 1024;

    const dp: Uint8Array[] = new Array(m * n);
    for (let i = 0; i < m * n; i++) {
        dp[i] = new Uint8Array(XOR_MAX);
    }
    dp[0][grid[0][0]] = 1;

    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            if (r === 0 && c === 0) continue;
            const cur = dp[r * n + c];
            const val = grid[r][c];
            if (r > 0) {
                const top = dp[(r - 1) * n + c];
                for (let x = 0; x < XOR_MAX; x++) {
                    if (top[x]) cur[x ^ val] = 1;
                }
            }
            if (c > 0) {
                const left = dp[r * n + (c - 1)];
                for (let x = 0; x < XOR_MAX; x++) {
                    if (left[x]) cur[x ^ val] = 1;
                }
            }
        }
    }
    const last = dp[(m - 1) * n + (n - 1)];
    for (let x = 0; x < XOR_MAX; x++) {
        if (last[x]) return x;
    }
    return 0;
}