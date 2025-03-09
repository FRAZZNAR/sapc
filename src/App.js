import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Card, Row, Col, Form, Badge, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "./App.css";
import Header from "./Header";
import SentimentChart from "./SentimentChart";

function App() {
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const temasPorPagina = 10;
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/tweets?page=${paginaActual}&limit=${temasPorPagina}`);

        setTweets(response.data.tweets);
        setTotalPaginas(response.data.totalPages);

        const statsResponse = await axios.get('http://localhost:3000/tweets/stats/sentiment');

        const totalTweets = statsResponse.data.reduce((sum, item) => sum + item.count, 0);
        const statsObj = {};

        statsResponse.data.forEach(item => {
          statsObj[item.sentiment] = Math.round((item.count / totalTweets) * 100);
        });
        setStats(statsObj);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchTweets();
  }, [paginaActual, temasPorPagina]);

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positivo': return 'success';
      case 'Negativo': return 'danger';
      case 'Neutral': return 'warning';
      default: return 'info';
    }
  };

  const tweetsFiltrados = tweets.filter(tweet =>
    (tweet.Tweet && tweet.Tweet.toLowerCase().includes(busqueda.toLowerCase())) ||
    (tweet.Hashtag && tweet.Hashtag.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="App">
      <Header userType={2} />
      <main>
        <Container fluid className="mt-4 px-0">
          <Card className="card text-center custom-card-width">
            <Card.Header>
              <h5>Análisis de Sentimiento en Tweets Políticos</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  {stats.Positivo && (
                    <span className="me-3">
                      <Badge bg="success">Positivo: {stats.Positivo}%</Badge>
                    </span>
                  )}
                  {stats.Neutral && (
                    <span className="me-3">
                      <Badge bg="warning">Neutral: {stats.Neutral}%</Badge>
                    </span>
                  )}
                  {stats.Negativo && (
                    <span>
                      <Badge bg="danger">Negativo: {stats.Negativo}%</Badge>
                    </span>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleShowModal}
                  className="ms-auto"
                >
                  <i className="fa-solid fa-chart-pie me-2"></i>
                  Ver Gráfica
                </Button>
              </div>

              <div className="input-group mt-2">
                <Form.Control
                  type="text"
                  placeholder="Buscar en tweets o hashtags..."
                  value={busqueda}
                  onChange={handleSearch}
                />
                <span className="input-group-text">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Hashtag</th>
                      <th>Tweet</th>
                      <th>Sentimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tweetsFiltrados.length > 0 ? (
                      tweetsFiltrados.map((tweet, index) => (
                        <tr key={index}>
                          <td>
                            {tweet.Hashtag ? (
                              <Badge bg="info">
                                #{tweet.Hashtag}
                              </Badge>
                            ) : (
                              <span className="text-muted">Sin hashtag</span>
                            )}
                          </td>
                          <td className="text-start">
                            <Link
                              to={`/tweet/${tweet._id}`}
                              className="text-decoration-none text-dark"
                            >
                              {tweet.Tweet}
                            </Link>
                          </td>
                          <td>
                            <Badge bg={getSentimentColor(tweet.Sentimiento)}>
                              {tweet.Sentimiento}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No se encontraron tweets que coincidan con la búsqueda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
            <Card.Footer>
              <Row className="d-flex justify-content-center align-items-center">
                <Col xs="auto">
                  <i
                    className="fa-regular fa-circle-left"
                    onClick={() => setPaginaActual(paginaActual > 1 ? paginaActual - 1 : paginaActual)}
                    style={{ cursor: "pointer", fontSize: "24px", color: "#214662" }}
                  ></i>
                </Col>
                <Col xs="auto">
                  <span className="text-muted">
                    Página {paginaActual} de {totalPaginas || 1}
                  </span>
                </Col>
                <Col xs="auto">
                  <i
                    className="fa-regular fa-circle-right"
                    onClick={() => setPaginaActual(paginaActual < totalPaginas ? paginaActual + 1 : paginaActual)}
                    style={{ cursor: "pointer", fontSize: "24px", color: "#214662" }}
                  ></i>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Container>
      </main>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Distribución de Sentimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ height: "400px" }}>
            <SentimentChart stats={stats} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;