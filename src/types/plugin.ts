export interface Plugin {
  sideBarIcon: SVGAElement;
  onInitialize: (e: any) => void;
  onClick: (e: any) => void;
  onClipboardUpdate: (e: any) => void;
  onAppFocus: (e: any) => void;
  onAppUnFocus: (e: any) => void;
  render: (e: any) => React.ReactNode;
}
