import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 Tunecore"
        subTitle="the next generation of music"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
