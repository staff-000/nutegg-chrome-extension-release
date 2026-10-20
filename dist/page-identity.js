var NutEggPageIdentity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shared/src/page-identity.ts
  var page_identity_exports = {};
  __export(page_identity_exports, {
    capturePageKey: () => capturePageKey,
    hostMatches: () => hostMatches,
    isApplicationHash: () => isApplicationHash,
    playbackPageKey: () => playbackPageKey
  });

  // shared/src/video-identity.ts
  function getVideoIdentity(url) {
    try {
      const u = new URL(url);
      if (u.protocol !== "https:" && u.protocol !== "http:")
        return null;
      const host = u.hostname.toLowerCase();
      const segments = u.pathname.split("/").filter(Boolean);
      const youtube = ["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"];
      let id = null;
      if (youtube.includes(host)) {
        if (segments[0] === "watch" && segments.length === 1)
          id = u.searchParams.get("v");
        else if (["shorts", "live", "embed", "v"].includes(segments[0]))
          id = segments[1];
      } else if (host === "youtu.be" || host === "www.youtu.be")
        id = segments[0];
      else if (["youtube-nocookie.com", "www.youtube-nocookie.com"].includes(host) && segments[0] === "embed")
        id = segments[1];
      if (id && /^[A-Za-z0-9_-]{11}$/.test(id))
        return { platform: "youtube", id, canonicalUrl: `https://www.youtube.com/watch?v=${id}` };
      if (["bilibili.com", "www.bilibili.com", "m.bilibili.com", "player.bilibili.com"].includes(host)) {
        id = segments[0] === "video" ? segments[1] : u.searchParams.get("bvid");
        if (id && /^BV[A-Za-z0-9]{10}$/.test(id)) {
          const part = Number(
            u.searchParams.get("p") || (host === "player.bilibili.com" ? u.searchParams.get("page") : null) || 1
          );
          return {
            platform: "bilibili",
            id,
            canonicalUrl: `https://www.bilibili.com/video/${id}${Number.isSafeInteger(part) && part > 1 ? `?p=${part}` : ""}`
          };
        }
      }
    } catch {
    }
    return null;
  }

  // shared/src/page-identity.ts
  function isApplicationHash(hash) {
    return /^#!?\//.test(hash);
  }
  function capturePageKey(value) {
    try {
      const url = new URL(value);
      if (!isApplicationHash(url.hash))
        url.hash = "";
      return url.href;
    } catch {
      return String(value || "");
    }
  }
  function hostMatches(value, domain) {
    try {
      const host = new URL(value).hostname.toLowerCase();
      return host === domain || host.endsWith(`.${domain}`);
    } catch {
      return false;
    }
  }
  function playbackPageKey(value) {
    return getVideoIdentity(value)?.canonicalUrl || capturePageKey(value);
  }
  return __toCommonJS(page_identity_exports);
})();
if (typeof module !== "undefined" && module.exports) module.exports = NutEggPageIdentity;
