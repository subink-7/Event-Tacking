import { Calendar } from "lucide-react";

function EventCard({ date, title, image }) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-[360px]">
      {/* Card background image */}
      <div className="absolute inset-0">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="flex items-center mb-2 opacity-90">
          <Calendar className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{date}</span>
        </div>
        <h3 className="text-2xl font-bold mb-2 group-hover:text-red-300 transition-colors">{title}</h3>
        <p className="text-white/80 mb-4">
          Experience the rich cultural traditions of Nepal through this authentic celebration.
        </p>
        <button className="w-full py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}

export default EventCard;
