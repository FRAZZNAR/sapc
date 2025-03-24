import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Card, Row, Col, Form, Badge, Button, Modal, Alert } from "react-bootstrap";
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
  
  // Estado para verificar si el usuario está logeado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Estado para el nombre de usuario
  const [userName, setUserName] = useState("Usuario");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setIsLoggedIn(true);
        
        try {
          const userInfo = JSON.parse(localStorage.getItem('usuario'));
          if (userInfo && userInfo.nombre) {
            setUserName(userInfo.nombre);
          } else if (userInfo && userInfo.correo) {
            setUserName(userInfo.correo.split('@')[0]);
          }
        } catch (error) {
          console.error("Error al parsear información del usuario:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        
        const currentPage = !isLoggedIn ? 1 : paginaActual;
        
        const url = isLoggedIn
          ? `https://gateway-41642489028.us-central1.run.app/tweets?page=${currentPage}&limit=${temasPorPagina}`
          : `https://gateway-41642489028.us-central1.run.app/tweets?page=1&limit=${temasPorPagina}`;
          
        const response = await axios.get(url);
        setTweets(response.data.tweets);
        setTotalPaginas(response.data.totalPages || 1);

        // Obtiene estadísticas de sentimientos
        const statsResponse = await axios.get('https://gateway-41642489028.us-central1.run.app/tweets/stats/sentiment');

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
  }, [paginaActual, temasPorPagina, isLoggedIn]);

  const handlePageChange = (newPage) => {
    if (!isLoggedIn && newPage > 1) {
      return;
    }
    
    setPaginaActual(newPage);
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };
  const getSentimentColor = (sentiment) => {
    const sentimentLowerCase = sentiment.toLowerCase();
    
    switch (sentimentLowerCase) {
      case 'positivo':
        return 'success';
      case 'negativo':
        return 'danger'; 
      case 'neutral':
        return 'warning';
      default:
        return 'info';
    }
  };
  const tweetsFiltrados = tweets.filter(tweet =>
    (tweet.Tweet && tweet.Tweet.toLowerCase().includes(busqueda.toLowerCase())) ||
    (tweet.Hashtag && tweet.Hashtag.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="App">
      <Header userType={isLoggedIn ? 2 : null} userName={userName} />
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
              {!isLoggedIn && (
                <Alert variant="info" className="my-2">
                  <i className="fa-solid fa-lock me-2"></i>
                  Inicia sesión para ver más páginas de tweets y acceder a todas las funcionalidades.
                </Alert>
              )}
              
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
                    className={`fa-regular fa-circle-left ${(!isLoggedIn || paginaActual <= 1) ? 'text-muted' : ''}`}
                    onClick={() => handlePageChange(paginaActual > 1 ? paginaActual - 1 : paginaActual)}
                    style={{ 
                      cursor: (isLoggedIn && paginaActual > 1) ? "pointer" : "not-allowed", 
                      fontSize: "24px", 
                      color: (isLoggedIn && paginaActual > 1) ? "#214662" : "#aaa" 
                    }}
                  ></i>
                </Col>
                <Col xs="auto">
                  <span className="text-muted">
                    Página {paginaActual} de {isLoggedIn ? (totalPaginas || 1) : 1}
                  </span>
                </Col>
                <Col xs="auto">
                  <i
                    className={`fa-regular fa-circle-right ${(!isLoggedIn || paginaActual >= totalPaginas) ? 'text-muted' : ''}`}
                    onClick={() => handlePageChange(paginaActual < totalPaginas ? paginaActual + 1 : paginaActual)}
                    style={{ 
                      cursor: (isLoggedIn && paginaActual < totalPaginas) ? "pointer" : "not-allowed", 
                      fontSize: "24px", 
                      color: (isLoggedIn && paginaActual < totalPaginas) ? "#214662" : "#aaa" 
                    }}
                  ></i>
                </Col>
              </Row>
              {!isLoggedIn && (
                <div className="mt-2">
                  <Button variant="outline-primary" size="sm" as={Link} to="/Inicio">
                    Iniciar Sesión
                  </Button>
                </div>
              )}
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
