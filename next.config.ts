import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A short address to share: ankitsin.in/resume opens the PDF in the browser.
  // Temporary (307) so the file behind it can be renamed later.
  async redirects() {
    return [{ source: "/resume", destination: "/ankit-sinha-resume.pdf", permanent: false }];
  },
};

export default nextConfig;
