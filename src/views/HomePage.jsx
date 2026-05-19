import profilePhoto from "@/assets/foto/optimized/get.jpeg";

export default function HomePage() {
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-lg py-xxl md:min-h-[70vh] md:px-md md:py-lg">
        <div className="max-w-[800px] mx-auto">
          <h1 className="page-title animate-fade-in">
            <span className="text-red font-bold inline-block animate-bounce-slow">Nice</span> to meet you! &#x1F601;
          </h1>
          <h2 className="animate-fade-in-slow text-gold opacity-90 text-xl">
            Hi, My name is Master Supakon Karanyawad
          </h2>
          <h2 className="animate-fade-in-slow text-gold mb-xl opacity-90 text-xl">
            but you can call me <span className="text-red font-bold">Get &#x1F680;</span>
          </h2>

          <img src={profilePhoto} alt="Master Supakon" className="h-auto mx-auto" />

          <div className="animate-fade-in-slower text-lg mb-xl leading-relaxed">
            <p className="text-white">
              Based in the <span className="text-gold">Netherlands</span>, I&apos;m a{" "}
              <span className="text-red">front end developer</span> &#x1F4BB;
            </p>
          </div>

          <div className="animate-fade-in-slowest flex items-center justify-center gap-lg">
            <a
              href="https://www.linkedin.com/in/get-ms-karanyawad"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon-large"
              aria-label="LinkedIn Profile"
            >
              <i className="bi bi-linkedin" />
            </a>
            <a
              href="https://github.com/Thaiseboy/Hi-"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon social-icon-large"
              aria-label="GitHub Profile"
            >
              <i className="bi bi-github" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
