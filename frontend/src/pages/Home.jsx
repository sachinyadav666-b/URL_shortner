import UrlForm from ".././components/UrlForm";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-8">Welcome to URL Shortener 🚀</h1>
      <p className="text-center text-gray-600 mt-2">
        Paste your long link below and get a short, shareable URL and QrCode.
      </p>
      <UrlForm />
    </div>
  );
}
