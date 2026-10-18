// An in-memory stand-in for the Sanity write client, with just what the inbox functions use: fetch by
// `id` or `ids`, createIfNotExists and patches with revision checks.

const KEY_PATH = /^replies\[_key=="([^"]+)"\]\.(\w+)$/;

let revision = 0;
const nextRev = () => `rev${(revision += 1)}`;

function applySet(doc, path, value) {
  const match = KEY_PATH.exec(path);
  if (!match) {
    doc[path] = value;
    return;
  }
  const entry = (doc.replies ?? []).find((item) => item._key === match[1]);
  if (entry) entry[match[2]] = value;
}

function applyUnset(doc, path) {
  const match = KEY_PATH.exec(path);
  if (!match) {
    delete doc[path];
    return;
  }
  const entry = (doc.replies ?? []).find((item) => item._key === match[1]);
  if (entry) delete entry[match[2]];
}

export function fakeSanity({ docs = {}, assets = {} } = {}) {
  const store = structuredClone(docs);
  for (const doc of Object.values(store)) doc._rev ??= nextRev();

  const fake = {
    store,
    /** Set to make the next `n` revision-checked commits fail, as if someone saved meanwhile. */
    conflicts: 0,

    async fetch(query, params = {}) {
      if (params.ids)
        return params.ids.flatMap((id) => (assets[id] ? [assets[id]] : []));
      const doc = store[params.id];
      return doc ? structuredClone(doc) : null;
    },

    async createIfNotExists(doc) {
      store[doc._id] ??= { ...structuredClone(doc), _rev: nextRev() };
      return store[doc._id];
    },

    patch(id) {
      const ops = [];
      let expectedRev = null;
      const builder = {
        ifRevisionId: (rev) => ((expectedRev = rev), builder),
        setIfMissing: (values) => (
          ops.push((doc) =>
            Object.entries(values).forEach(([k, v]) => (doc[k] ??= v)),
          ),
          builder
        ),
        append: (field, items) => (
          ops.push((doc) => doc[field].push(...structuredClone(items))),
          builder
        ),
        set: (values) => (
          ops.push((doc) =>
            Object.entries(values).forEach(([k, v]) => applySet(doc, k, v)),
          ),
          builder
        ),
        unset: (paths) => (
          ops.push((doc) => paths.forEach((path) => applyUnset(doc, path))),
          builder
        ),
        commit: async () => {
          const doc = store[id];
          if (!doc) throw new Error("not found");
          if (expectedRev) {
            if (fake.conflicts > 0) {
              fake.conflicts -= 1;
              doc._rev = nextRev();
            }
            if (doc._rev !== expectedRev) throw new Error("revision mismatch");
          }
          ops.forEach((op) => op(doc));
          doc._rev = nextRev();
          return doc;
        },
      };
      return builder;
    },
  };

  return fake;
}
