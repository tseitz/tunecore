import React from "react";
import { Image, Row, Col } from "antd";
import Tune from "./Tune";

export default function Feed({ writeContracts, tx }) {
  return (
    <>
      {Array.from({ length: 3 }, (_, index) => {
        return (
          <Row>
            <Col span={6}>
              <Image
                width={180}
                src="https://www.youredm.com/wp-content/uploads/2018/10/excision-grinning-bass-canyon-2018-rukes.jpg"
              />
            </Col>
            <Col>
              <Tune writeContracts={writeContracts} tx={tx} id={index} />
            </Col>
          </Row>
        );
      })}
    </>
  );
}
