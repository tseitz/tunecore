import React from "react";
import { Button } from "antd";
import { PlayCircleTwoTone } from "@ant-design/icons";

export default function Tune({ id, writeContracts, tx }) {
  return (
    <>
      <div>{id}</div>
      <Button icon={<PlayCircleTwoTone />} onClick={() => tx(writeContracts.YourContract.playSong(id))}>
        Play
      </Button>
    </>
  );
}
