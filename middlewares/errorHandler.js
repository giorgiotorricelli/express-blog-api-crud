

function errorHandlerShowAndDel(request, response, next) {
  
  const slug = (request.params.slug).trim();

  if (slug === '') {
    console.log('empty slug error');
    
    response.status(400).json({
      message: "Lo slug non può essere vuoto"
    });
    return;
  }

  if (!isNaN(Number(slug))) { //se slug è un numero
    console.log('number as slug error');
    response.status(400).json({
      message: "Lo slug non può essere un numero"
    });
    return;
  }

  next();
}

export default errorHandlerShowAndDel;