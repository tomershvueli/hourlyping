import Form from "react-bootstrap/Form";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Alarm({ alarm, setAlarmMinute, deleteAlarm, idx }) {
  return (
    <Container className="mb-2">
      <Row>
        <Col sm={11}>
          <Form.Control
            type="number"
            max="59"
            min="0"
            onChange={(e) => setAlarmMinute(e.target.value, idx)}
            value={alarm.minute < 10 ? `0${alarm.minute}` : alarm.minute}
          />
        </Col>
        <Col sm={1}>
          <CloseButton onClick={() => deleteAlarm(idx)} aria-label="Delete Alarm" />
        </Col>
      </Row>
    </Container>
  );
}

export default Alarm;
