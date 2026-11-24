const fs = require("fs").promises;
const path = require("path");

// Weekly score snapshots, kept in a plain JSON file.
//
// Why a file and not a database: this repo has no database layer yet
// (README roadmap lists "Database Integration" as planned, and the
// mysql2 dependency is unused). A file store adds no new dependency
// and is enough for one snapshot per user per week.
//
// CAVEAT: Render free web services have ephemeral disks, so this file
// is lost on restart/redeploy. It is fine for local use and for proving
// the feature, but production needs a durable store — Render Postgres
// free tier, wired through DATABASE_URL. See render.yaml notes.
const STORE_PATH =
    process.env.SNAPSHOT_FILE ||
    path.join(__dirname, "..", "data", "snapshots.json");

// One year of weekly snapshots per user.
const MAX_SNAPSHOTS_PER_USER = 52;

// ISO week key, e.g. "2026-W48". One snapshot per user per week.
function getWeekKey(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7; // Mon=1 .. Sun=7
    d.setUTCDate(d.getUTCDate() + 4 - day); // shift to Thursday of this week
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

async function loadStore() {
    try {
        const raw = await fs.readFile(STORE_PATH, "utf8");
        return JSON.parse(raw);
    } catch (err) {
        if (err.code !== "ENOENT") {
            console.error("Snapshot store unreadable, starting empty:", err.message);
        }
        return {};
    }
}

async function saveStore(store) {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

// Record (or refresh) this week's snapshot for a user.
// Same user + same week updates the row in place, never a duplicate.
async function recordSnapshot(username, data) {
    const key = username.toLowerCase();
    const store = await loadStore();
    const list = store[key] || [];
    const week = getWeekKey();
    const snapshot = {
        date: new Date().toISOString().slice(0, 10),
        week,
        score: data.score,
        tier: data.tier,
        breakdown: data.breakdown,
        totalStars: data.totalStars,
        followers: data.followers,
        publicRepos: data.publicRepos,
        totalContributions: data.totalContributions
    };
    const existing = list.findIndex((s) => s.week === week);
    if (existing >= 0) list[existing] = snapshot;
    else list.push(snapshot);
    list.sort((a, b) => a.date.localeCompare(b.date));
    store[key] = list.slice(-MAX_SNAPSHOTS_PER_USER);
    await saveStore(store);
    return snapshot;
}

async function getHistory(username) {
    const store = await loadStore();
    return store[username.toLowerCase()] || [];
}

async function getLatestSnapshot(username) {
    const history = await getHistory(username);
    return history.length ? history[history.length - 1] : null;
}

module.exports = {
    getWeekKey,
    recordSnapshot,
    getHistory,
    getLatestSnapshot
};
