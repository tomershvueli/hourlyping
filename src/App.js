import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Navbar from "react-bootstrap/Navbar";
import Figure from "react-bootstrap/Figure";

import { FaGithub } from "react-icons/fa";

import "./App.css";
import Alarm from "./Alarm";

import "./clock.css";
import Footer from "./Footer";
import KoFi from "./KoFi";

function App() {
  // Neat trick to leverage a local storage hook for React state
  // https://www.robinwieruch.de/local-storage-react/
  const useLocalStorage = (storageKey, fallbackState) => {
    const [value, setValue] = useState(
      JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState
    );

    useEffect(() => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }, [value, storageKey]);

    return [value, setValue];
  };

  const [paused, setPaused] = useLocalStorage("paused", false);
  const [alarms, setAlarms] = useLocalStorage("alarms", [{ minute: 5 }]);
  const [earlyHour, setEarlyHour] = useLocalStorage("earlyHour", 9);
  const [lateHour, setLateHour] = useLocalStorage("lateHour", 17);
  const [alarmOnWeekends, setAlarmOnWeekends] = useLocalStorage(
    "alarmOnWeekends",
    false
  );

  // Notifications and modal don't require local state
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const notify = (text = "Hi there!") => {
    const now = new Date();
    const curHour = now.getHours();
    const curDay = now.getDay();
    if (!paused) {
      if (alarmOnWeekends || (!alarmOnWeekends && ![0, 6].includes(curDay))) {
        if (curHour >= earlyHour && curHour < lateHour) {
          new Notification(text, {
            body: "Reminder to take a break!",
          });
        }
      }
    }
  };

  const requestNotifications = () => {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // Check whether notification permissions have already been granted;
      // if so, create a notification
      setNotificationsAllowed(true);
    } else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          setNotificationsAllowed(true);
        }
      });
    }
  };

  const handleCloseAboutModal = () => setShowAboutModal(false);
  const handleShowAboutModal = () => setShowAboutModal(true);

  const togglePause = () => {
    setPaused((paused) => !paused);
  };

  const deleteAlarm = (idx) => {
    const newAlarms = alarms.filter((_i, alarmIdx) => alarmIdx !== idx);
    setAlarms(newAlarms);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const mins = [];
      alarms.forEach((a) => mins.push(+a.minute));

      if (mins.includes(now.getMinutes())) {
        notify(`Hourly Ping - Minute ${now.getMinutes()}`);
      }
    }, 60000);

    return () => clearInterval(timer);
  });

  const setAlarmMinute = (minute, idx) => {
    const newAlarms = [...alarms];
    newAlarms[idx].minute = minute;
    setAlarms(newAlarms);
  };

  return (
    <div className="App">
      <Container>
        <Navbar className="border-bottom border-2">
          <Container>
            <Navbar.Brand as="h1" className="fs-2">
              Hourly Ping
            </Navbar.Brand>
            <Navbar.Text as="h4" className="pb-0">Simple, hourly notifications</Navbar.Text>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text className="fs-2 pt-0 me-2">
                <a href="https://github.com/tomershvueli/hourlyping">
                  <FaGithub />
                </a>
              </Navbar.Text>
              <Navbar.Text>
                <KoFi color="#00b5ad" id="D1D41JRJE" label="Buy me a Coffee" />
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Row className="my-4">
          <Col
            sm={8}
            className={`text-center border-end border-2${
              paused ? " opacity-50" : ""
            }`}
          >
            <Form.Group className="mb-2">
              <p className="text-center">Between the hours of </p>
              <Col sm={{ span: 2, offset: 5 }}>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0"
                    max="23"
                    onChange={(e) => setEarlyHour(e.target.value)}
                    value={earlyHour}
                    aria-label="Early Hour"
                    aria-describedby="early-hour"
                  />
                  <InputGroup.Text id="early-hour">:00</InputGroup.Text>
                </InputGroup>
              </Col>
              <p sm={4}> and </p>
              <Col sm={{ span: 2, offset: 5 }}>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0"
                    max="23"
                    onChange={(e) => setLateHour(e.target.value)}
                    value={lateHour}
                    aria-label="Late Hour"
                    aria-describedby="late-hour"
                  />
                  <InputGroup.Text id="late-hour">:00</InputGroup.Text>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check
                type="checkbox"
                name="alarmOnWeekends"
                id="alarmOnWeekends"
                checked={alarmOnWeekends}
                inline
                onChange={(e) => setAlarmOnWeekends(e.target.checked)}
              />
              <label htmlFor="alarmOnWeekends">Enable on weekends?</label>
            </Form.Group>
          </Col>
          <Col sm={4}>
            <div>
              <Button
                variant={paused ? "success" : "danger"}
                onClick={togglePause}
              >
                {paused ? "▶️ Resume" : "⏸ Pause"}
              </Button>
            </div>
            {"Notification" in window &&
              !notificationsAllowed &&
              Notification.permission !== "granted" && (
                <div>
                  <br />
                  <Button
                    type="button"
                    onClick={requestNotifications}
                    variant="outline-primary"
                  >
                    Enable Notifications!
                  </Button>
                </div>
              )}
          </Col>
        </Row>
        <Row className="mb-4 bg-white">
          <Container
            className={`border border-2 rounded-3${
              paused ? " opacity-50" : ""
            }`}
          >
            <Row style={{ minHeight: "450px" }}>
              <Col sm={8} className="position-relative">
                <div className="clock">
                  {alarms.map((i, idx) => (
                    <div
                      className="sec_hand"
                      key={idx}
                      style={{
                        transform: `rotateZ(${i.minute * 6}deg)`,
                      }}
                    />
                  ))}
                  <span className="twelve">12</span>
                  <span className="one">1</span>
                  <span className="two">2</span>
                  <span className="three">3</span>
                  <span className="four">4</span>
                  <span className="five">5</span>
                  <span className="six">6</span>
                  <span className="seven">7</span>
                  <span className="eight">8</span>
                  <span className="nine">9</span>
                  <span className="ten">10</span>
                  <span className="eleven">11</span>
                </div>
              </Col>
              <Col sm={4} className="mt-4">
                {alarms.map((i, idx) => (
                  <Alarm
                    key={idx}
                    setAlarmMinute={setAlarmMinute}
                    deleteAlarm={deleteAlarm}
                    alarm={i}
                    idx={idx}
                    style={{ display: "block" }}
                  />
                ))}
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={{ span: 3, offset: 4 }}>
                <Button
                  onClick={() => {
                    const newAlarms = [...alarms];
                    const curMins = new Date().getMinutes();
                    const nextMin = curMins === 59 ? 0 : curMins + 1;
                    newAlarms.push({ minute: nextMin });
                    setAlarms(newAlarms);
                  }}
                  size="lg"
                >
                  Add Alarm
                </Button>
              </Col>
            </Row>
          </Container>{" "}
        </Row>
        <Row>
          <Col sm={{ span: 4, offset: 4 }}>
            <Button type="button" onClick={handleShowAboutModal}>
              What is Hourly Ping?
            </Button>
          </Col>
        </Row>
      </Container>
      <Modal show={showAboutModal} onHide={handleCloseAboutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Hourly Ping</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Hourly Ping was born out of a Hacker News comment that caught my
            attention:
          </p>
          <Figure>
            <blockquote className="blockquote">
              <p>
                ...I would set an alarm every 30 minutes and take short brakes
                (2-5mins) from work....
              </p>
            </blockquote>
            <Figure.Caption className="blockquote-footer">
              zaplin{" "}
              <cite title="Source Title">
                <a href="https://news.ycombinator.com/item?id=32480011">
                  Source
                </a>
              </cite>
            </Figure.Caption>
          </Figure>
          <p>I couldn't find an easy to use web application that I could simply set a minute on a clock, and it would ping me once per hour on that minute.</p>
          <p>Simple, hourly notifications to keep your breaks consistent. </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseAboutModal}>
            Thanks!
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer />
    </div>
  );
}

export default App;
