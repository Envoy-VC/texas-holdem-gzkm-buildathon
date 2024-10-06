export interface OverlayProps {
  contractAddress: `0x${string}`;
  refresh?: () => Promise<void>;
}
