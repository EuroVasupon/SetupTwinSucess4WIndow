const handlePort = (port: number | string | undefined): number | undefined => {
  let newPort;

  if (port && typeof port === 'number') {
    newPort = port;
  } else if (port && typeof port === 'string') {
    if (!isNaN(parseInt(port))) {
      newPort = parseInt(port);
    }
  }

  return newPort;
};

export default handlePort;
