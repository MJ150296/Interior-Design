import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AiOutlineFileDone,
  AiOutlineCarryOut,
  AiFillShop,
} from "react-icons/ai";
import useInView from "@/app/hooks/useInView";
import { ShieldCheck } from "lucide-react";

const serviceCards = [
  {
    icon: <AiOutlineFileDone size={40} />,
    title: "Easy EMIs",
    color: "text-blue-600",
    description: "Flexible payment options to suit your budget.",
  },
  {
    icon: <AiOutlineCarryOut size={40} />,
    title: "45 days",
    color: "text-green-600",
    description: "45 days move-in guarentee.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "120+ checks",
    color: "text-yellow-600",
    description: "Ensuring top-notch quality in every project.",
  },
  {
    icon: <AiFillShop size={40} />,
    title: "30+ cities",
    color: "text-red-600",
    description: "Serving over 30 cities with our expert services.",
  },
];

const CustomerSupport: React.FC = () => {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref}>
      <div
        className={`text-4xl w-full flex justify-center items-end text-center font-bold mb-12 transition-all duration-1300 ease-in-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <p className="text-9xl text-amber-950 italic font-serif">10+</p>
        <div className="pb-3">
          <p className="font-semibold text-amber-500 italic">
            years of experience
          </p>
        </div>
      </div>
      <div
        className="relative bg-cover bg-fixed bg-center w-full rounded-2xl h-[800px] md:h-[500px]"
        style={{
          backgroundImage: "url('/Riddhi Interior Design/why-choose-us.jpg')",
        }}
      >
        <div className="text-center py-14">
          <h1 className="text-5xl font-bold text-amber-950 py-2 px-10 md:px-32 rounded-lg inline-block">
            Why Choose Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-10">
          {serviceCards.map((card, index) => (
            <Card
              key={index}
              className="p-2 text-center bg-black/50 transition-transform duration-300 hover:scale-105"
            >
              <CardHeader>
                <div
                  className={`flex justify-center items-center space-x-3 ${card.color}`}
                >
                  {card.icon}
                  <CardTitle className="text-2xl text-white">
                    {card.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
