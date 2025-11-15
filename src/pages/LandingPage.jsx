
import Navbar from "../components/Navbar";
import HeroSection from "../sections/HeroSection";
import Footer from "../components/Footer";


const LandingPage = () => {
  return (
    <div className="font-[Inter] min-h-screen  flex flex-col justify-between antialiased bg-gray-50">
      <Navbar />
      <main className="grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
};


export default LandingPage;