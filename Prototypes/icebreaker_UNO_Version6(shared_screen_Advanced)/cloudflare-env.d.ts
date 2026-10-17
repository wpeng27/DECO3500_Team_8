declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    MOBILE_LAN_ADDRESSES?: string;
  }
}
