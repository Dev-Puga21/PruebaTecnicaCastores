import '../css/NotFound.css'; // Importa el estilo personalizado

const NotFound = () => {


  return (
    <div className="container">
      <h2 className="error-code">404 - Not Found</h2>
      <p className="error-message">The page you are looking for does not exist.</p>
      <a href="/" className="back-to-home">
        Back to Home
      </a>
    </div>
  )

}

export default NotFound