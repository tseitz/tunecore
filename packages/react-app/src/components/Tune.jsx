import React from "react"
import { Button } from "antd"
import { PlayCircleTwoTone } from "@ant-design/icons"
import { Row, Col, Image } from 'antd'

export default function Tune({ track, writeContracts, tx }) {
  return (
    <Row>
      <Col span={6}>
        <Image src={track.artwork && track.artwork["150x150"]} alt="artwork" />
      </Col>
      <Col>
        <div className="title">{track.title}</div>
        <div className="artist">{track.user.name}</div>
        <Button icon={<PlayCircleTwoTone />} onClick={() => tx(writeContracts.YourContract.playSong(track.id))}>
          Play
        </Button>
      </Col>
    </Row>
  );
}
