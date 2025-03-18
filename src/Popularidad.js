import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Card, Collapse, Badge } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import HeaderComponent from './HeaderComponent.js';

const Popularidad = () => {
  const navigate = useNavigate();
  const [allTweets, setAllTweets] = useState([]);
  const [hashtagData, setHashtagData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedHashtag, setExpandedHashtag] = useState(null);

  useEffect(() => {
    const fetchTweetsAndCountHashtags = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://gateway-41642489028.us-central1.run.app/tweets');
        
        const tweets = response.data.tweets;
        
        if (Array.isArray(tweets)) {
          setAllTweets(tweets);
          
          const hashtagCounts = countHashtags(tweets);
          
          const hashtagArray = Object.entries(hashtagCounts)
            .map(([hashtag, count]) => ({
              hashtag,
              count,
              tweets: tweets.filter(tweet => 
                tweet.Tweet && tweet.Tweet.toLowerCase().includes(hashtag.toLowerCase())
              )
            }))
            .sort((a, b) => b.count - a.count);
          
          setHashtagData(hashtagArray);
        } else {
          console.error("La respuesta de la API no contiene un array en 'tweets'.");
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los tweets:", error);
        setLoading(false);
      }
    };
    
    fetchTweetsAndCountHashtags();
  }, []);
  

  const countHashtags = (tweets) => {
    const hashtagCounts = {};
    
    tweets.forEach(tweet => {
      if (!tweet.Tweet) return;
      
      const hashtags = tweet.Tweet.match(/#[a-zA-Z0-9_áéíóúüñÁÉÍÓÚÜÑ]+/g) || [];
      
      hashtags.forEach(hashtag => {
        const tag = hashtag.substring(1);
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
    
    return hashtagCounts;
  };

  const getColor = (count) => {
    if (count > 15) return '#008000'; 
    if (count > 5) return '#FFD700';
    return '#FF0000'; 
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 500
    },
    title: {
      text: 'Hashtags Más Populares en Tweets Políticos'
    },
    xAxis: {
      categories: hashtagData.slice(0, 10).map(item => `#${item.hashtag}`),
      title: {
        text: 'Hashtags'
      }
    },
    yAxis: {
      title: {
        text: 'Número de Tweets'
      }
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Tweets',
      data: hashtagData.slice(0, 10).map(item => ({
        y: item.count,
        color: getColor(item.count)
      }))
    }]
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    localStorage.setItem('usuario', null);
    navigate('/');
  };

  // Función para descargar PDF
  const descargarPDF = () => {
    const input = document.getElementById('contenido');
    
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);
      pdf.save('Hashtags_Mas_Populares.pdf');
    });
  };

  // Función para ver los tweets de un hashtag específico
  const toggleTweets = (hashtag) => {
    if (expandedHashtag === hashtag) {
      setExpandedHashtag(null);
    } else {
      setExpandedHashtag(hashtag);
    }
  };

  // Función para obtener el color de la insignia de sentimiento
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'Positivo': return 'success';
      case 'Negativo': return 'danger';
      case 'Neutral': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="bootstrap-container">
      <NavBar userType={1} />
      <div className="main-content">
        <header className="header">
        <HeaderComponent />

        </header>

        <div className="container mt-4">
          <Button variant="dark" className="d-flex align-items-center" aria-label="Descargar en PDF" onClick={descargarPDF}>
            <span className="fw-bold">Descargar en PDF</span>
            <i className="fa-regular fa-file-pdf ms-2"></i>
          </Button>
        </div>

        <div id="contenido">
          <h2 className="text-center mt-4">Hashtags Más Populares en Tweets Políticos</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <>
              <Container className="mt-4" style={{ maxWidth: '90%' }}>
                <Table striped bordered hover className="mt-3" style={{ fontSize: '1.2rem' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Hashtag</th>
                      <th>Cantidad de Tweets</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hashtagData.slice(0, 10).map((item, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{index + 1}</td>
                          <td>#{item.hashtag}</td>
                          <td>{item.count}</td>
                          <td>
                            <Button 
                              variant="outline-primary"
                              onClick={() => toggleTweets(item.hashtag)}
                              aria-expanded={expandedHashtag === item.hashtag}
                            >
                              {expandedHashtag === item.hashtag ? (
                                <>
                                  <i className="fa-solid fa-eye-slash me-2"></i>
                                  Ocultar Tweets
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-eye me-2"></i>
                                  Ver Tweets
                                </>
                              )}
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="p-0">
                            <Collapse in={expandedHashtag === item.hashtag}>
                              <div>
                                <Card className="m-3">
                                  <Card.Header className="bg-light">
                                    <h5 className="mb-0">Tweets con el hashtag #{item.hashtag}</h5>
                                  </Card.Header>
                                  <Card.Body>
                                    {item.tweets.length > 0 ? (
                                      <Table responsive borderless>
                                        <thead>
                                          <tr>
                                            <th>Tweet</th>
                                            <th>Sentimiento</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {item.tweets.map((tweet, tweetIndex) => (
                                            <tr key={tweetIndex}>
                                              <td>{tweet.Tweet}</td>
                                              <td>
                                                <Badge bg={getSentimentColor(tweet.Sentimiento)}>
                                                  {tweet.Sentimiento}
                                                </Badge>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    ) : (
                                      <p className="text-center">No se encontraron tweets para este hashtag.</p>
                                    )}
                                  </Card.Body>
                                </Card>
                              </div>
                            </Collapse>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </Table>
              </Container>

              <Container className="mt-5 mb-5" style={{ maxWidth: '100%' }}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              </Container>

              <Container>
                <div className="mt-4 d-flex justify-content-center mb-5">
                  <div className="d-flex align-items-center me-4">
                    <div style={{ width: 20, height: 20, backgroundColor: '#008000', marginRight: 10 }}></div>
                    <span>Más de 15 Tweets</span>
                  </div>
                  <div className="d-flex align-items-center me-4">
                    <div style={{ width: 20, height: 20, backgroundColor: '#FFD700', marginRight: 10 }}></div>
                    <span>Entre 5 y 15 Tweets</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div style={{ width: 20, height: 20, backgroundColor: '#FF0000', marginRight: 10 }}></div>
                    <span>Menos de 5 Tweets</span>
                  </div>
                </div>
              </Container>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popularidad;
