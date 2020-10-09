import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/tseitz/tunecore" target="_blank" rel="noopener noreferrer">
      <PageHeader title="🎵 TuneChainz" subTitle="the next generation of sound" style={{ cursor: "pointer" }} />
    </a>
  );
}
