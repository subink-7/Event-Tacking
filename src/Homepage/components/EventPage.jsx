
import { Header } from "../../utils/components/Header";
import { Footer } from "../../utils/components/Footer";
import EventCard from "./Eventcard";

const upcomingEvents = [
  {
    date: "8 December",
    title: "Yomari Punhi",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/6b8fcfbe4cef8db1b815bad97be278d358ccca533e79ff181206e2d70e575f32?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf",
  },
  {
    date: "8 December",
    title: "Udhauli Parva",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e0a8b3cc0cc52eb55a0b7e679ace61ad13ac81c058766b8cf802254bb5223ada?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf",
  },
  {
    date: "9 December",
    title: "Matina Paru",
    image:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/72da5e9234f09d4d6fdba0c6f6b9a7e2045c491163340bb4cebb7f679b1e292a?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#fcf9f5] font-sans">
      {/* Decorative elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/rice-paper-3.png')] opacity-10"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-100 mix-blend-multiply opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-amber-100 mix-blend-multiply opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 rounded-full bg-orange-100 mix-blend-multiply opacity-20 blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <Header />
      </div>

      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] max-h-[600px] overflow-hidden rounded-full mt-5">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/606897a42dd2949a562d0fc9bec01211ef20ece62d7178d2c8954ba50e7872a4?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
          alt="Cultural event banner"
          className="object-cover w-full h-full scale-105 animate-[slowZoom_5s_ease-in-out_infinite_alternate] "
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
          <div className="text-center px-6 max-w-4xl mx-auto transform translate-y-8 animate-[fadeUp_1s_ease-out_forwards]">
            <h1 className="text-4xl md:text-5xl  text-white mb-4 tracking-tight font-thin"> 
              <span className="block">Celebrating Nepal's</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-red-300">
                Cultural Heritage
              </span>
            </h1>
            {/* <div className="w-20 h-1 bg-red-500 mx-auto mt-2 mb-6"></div> */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover the rich tapestry of traditions, festivals, and celebrations that make Nepal unique
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Quote Section */}
        <div className="relative mb-32 max-w-4xl mx-auto">
          <div className="absolute -left-8 top-0 transform -translate-y-1/2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6c71bd83708c4d13461bc75075d878344f65ad101ab0eb5a9c937de34b2bf4f1?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt="Decorative element"
              className="w-20 h-20 md:w-28 md:h-28 opacity-90 animate-pulse"
            />
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-amber-100">
            <p className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed italic">
              In the heart of Nepal, diversity blooms like a garden of vibrant cultures, each petal telling its own
              story, yet together creating a masterpiece of harmony and pride. From the towering Himalayas to the
              fertile plains, every step reveals a mosaic of traditions. Here, unity is not just a choice but a way of
              life, celebrated in every festival, language, and smile.
            </p>
          </div>
          <div className="absolute -right-8 bottom-0 transform translate-y-1/2">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7d3719bc0454f79e77f78659bd070f337d60752d172cb4e5f67b8797110ed05?placeholderIfAbsent=true&apiKey=003454df7a3c4f25a3bd7334b00a00cf"
              alt="Decorative element"
              className="w-20 h-20 md:w-28 md:h-28 opacity-90 animate-pulse"
            />
          </div>
        </div>

        {/* Events Section */}
        <div className="relative mt-20">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-50 rounded-full opacity-40 blur-3xl"></div>

          <div className="relative mb-16 text-center">
            <h2 className="inline-block text-4xl font-bold relative z-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-600">
                Upcoming Events
              </span>
              <div className="absolute -bottom-4 left-0 right-0 mx-auto w-40 h-1 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></div>
            </h2>
            <div className="mt-6 max-w-2xl mx-auto">
              <p className="text-gray-600">
                Join us in celebrating Nepal's rich cultural heritage through these special events
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 transform group-hover:scale-[1.02] group-hover:shadow-2xl bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                  <EventCard {...event} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="px-8 py-3 bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              View All Events
            </button>
          </div>
        </div>
      </div>

    

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}