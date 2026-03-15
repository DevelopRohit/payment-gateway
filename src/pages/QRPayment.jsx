function QRPayment() {

  return (

    <div className="form">

      <h2>QR Code Payment</h2>

      <img 
      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PayIndia"
      alt="qr"
      />

      <p>Scan this QR with your UPI App</p>

    </div>

  );

}

export default QRPayment;