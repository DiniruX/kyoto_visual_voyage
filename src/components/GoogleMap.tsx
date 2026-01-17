// Balage Diniru Sandipa
// M25W0576

interface GoogleMapProps {
  lat: number;
  lng: number;
  address: string;
}

const GoogleMap = ({ lat, lng, address }: GoogleMapProps) => {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=15`;

  return (
    <div className="w-full h-80 rounded-lg overflow-hidden shadow-md">
      <iframe
        title={`Map - ${address}`}
        width="100%"
        height="100%"
        frameBorder="0"
        src={mapUrl}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GoogleMap;
