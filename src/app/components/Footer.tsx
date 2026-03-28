import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">P</span>
              </div>
              <div>
                <div className="font-bold text-lg">PEGASUS FC</div>
                <div className="text-xs text-primary italic">Conquer Our Opponents</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              Forging Lagos' next football champions since 2023. Professional youth football
              academy based in Badore, Ajah, Lekki.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link to="/programs" className="hover:text-primary transition">Programs</Link></li>
              <li><Link to="/squad" className="hover:text-primary transition">Squad</Link></li>
              <li><Link to="/recruitment" className="hover:text-primary transition">Book a Trial</Link></li>
              <li><Link to="/media" className="hover:text-primary transition">Media Hub</Link></li>
            </ul>
          </div>

          {/* Training Info */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Training Schedule</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><strong>Days:</strong> Fridays & Saturdays</li>
              <li><strong>Time:</strong> 4:00 PM - 7:30 PM</li>
              <li><strong>Age Groups:</strong> U7 - U16</li>
              <li><strong>Location:</strong> Badore, Ajah, Lekki</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                <span className="text-gray-300">Badore, Ajah, Lekki, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href="tel:+2349034630407" className="hover:text-primary transition">
                  +234-9034-6304-07
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href="mailto:pegasusfcacademy@gmail.com" className="hover:text-primary transition break-all">
                  pegasusfcacademy@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <FacebookIcon className="w-4 h-4 flex-shrink-0 text-primary" />
                <a
                  href="https://facebook.com/share/1ZmkJ86wXN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  Follow on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pegasus Football Academy. All rights reserved.</p>
          <p className="mt-2">
            <strong className="text-primary">President:</strong> Martins Imabeh | <strong className="text-primary">Established:</strong> 2023
          </p>
        </div>
      </div>
    </footer>
  );
}
