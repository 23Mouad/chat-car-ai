"use client";

/**
 * Wrapper that lazy-loads below-fold landing sections on the client.
 * This must be a Client Component so that ssr:false is allowed on SocialProof
 * (which uses EventSource / browser APIs inside useEffect).
 */
import dynamic from "next/dynamic";

const SocialProof = dynamic(
  () => import("@/components/landing/SocialProof").then((m) => m.SocialProof),
  { ssr: false } // EventSource is a browser-only API
);

const FeatureGrid = dynamic(() =>
  import("@/components/landing/FeatureGrid").then((m) => m.FeatureGrid)
);

const AlgorixFooter = dynamic(() =>
  import("@/components/landing/AlgorixFooter").then((m) => m.AlgorixFooter)
);

export function BelowFold() {
  return (
    <>
      <SocialProof />
      <FeatureGrid />
      <AlgorixFooter />
    </>
  );
}
