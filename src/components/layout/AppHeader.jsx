import logo from "@/assets/foto/logo2.png";

export default function AppHeader() {
  return (
    <header className="text-gold flex justify-center items-center min-h-screen bg-black p-0 m-0">
      <div className="container flex flex-col items-center">
        <div className="text-center">
          <img src={logo} alt="Logo" className="max-h-[250px] mx-auto" />
        </div>
      </div>
    </header>
  );
}
