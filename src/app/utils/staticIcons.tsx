import {
  FiImage,
  FiAward,
  FiHome,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiClock,
  FiStar,
  FiMail,
  FiGlobe,
  FiUsers,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

export const iconMap: { [key: string]: React.ReactElement } = {
  image: <FiImage className="w-6 h-6" />,
  award: <FiAward className="w-6 h-6" />,
  house: <FiHome className="w-6 h-6" />,
  calendar: <FiCalendar className="w-6 h-6" />,
  phone: <FiPhone className="w-6 h-6" />,
  "map-pin": <FiMapPin className="w-6 h-6" />,
  clock: <FiClock className="w-6 h-6" />,
  star: <FiStar className="w-6 h-6" />,
  mail: <FiMail className="w-6 h-6" />,
  globe: <FiGlobe className="w-6 h-6" />,
  users: <FiUsers className="w-6 h-6" />,
  "message-square": <FiMessageSquare className="w-6 h-6" />,
  settings: <FiSettings className="w-6 h-6" />,
};

export const iconOptions = [
  { value: "image", label: "Image" },
  { value: "award", label: "Award" },
  { value: "house", label: "House" },
  { value: "calendar", label: "Calendar" },
  { value: "phone", label: "Phone" },
  { value: "map-pin", label: "Map Pin" },
  { value: "clock", label: "Clock" },
  { value: "star", label: "Star" },
  { value: "mail", label: "Mail" },
  { value: "globe", label: "Globe" },
  { value: "users", label: "Users" },
  { value: "message-square", label: "Message Square" },
  { value: "settings", label: "Settings" },
];

export const getStaticIcon = (iconName: string) => {
  return iconMap[iconName] || <FiStar className="w-6 h-6" />;
};