// GoatCounter's count.js attaches this to window once it loads.
// See https://www.goatcounter.com/help/js
interface Window {
  goatcounter?: {
    count: (opts: { path: string; title?: string; event?: boolean }) => void;
  };
}
