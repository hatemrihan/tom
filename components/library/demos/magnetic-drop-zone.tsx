"use client";

import { MagneticDropZone } from "../magnetic-drop-zone/magnetic-drop-zone";

export default function MagneticDropZoneDemo() {
  return <MagneticDropZone onFiles={(files) => console.log("Received", files)} />;
}
