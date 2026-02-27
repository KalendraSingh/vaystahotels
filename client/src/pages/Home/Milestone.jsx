import React from 'react';
import { Building2, Building, Hotel, SmilePlus } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import { useInView } from 'react-intersection-observer';

const stats = [
  { icon: Building, number: 50, label: 'Cities' },
  { icon: Building2, number: 1300, label: 'Hotels' },
  { icon: Hotel, number: 36000, label: 'Rooms' },
  { icon: SmilePlus, number: 4000000, label: 'Happy Guests' },
];

function StatCard({ icon: Icon, number, label }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });

  const { val } = useSpring({
    from: { val: 0 },
    to: { val: inView ? number : 0 },
    config: { mass: 1, tension: 40, friction: 14 },
    delay: 150,
  });

  return (
    <div
      ref={ref}
      className="bg-white border-2 border-[#E5C100] p-4 md:p-5 rounded-xl shadow-md text-center hover:scale-[1.03] transition-all duration-300"
    >
      <div className="flex justify-center items-center mb-3">
        <div className="bg-gradient-to-br from-[#FF9472] to-[#F2709C] p-3 rounded-full shadow-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <animated.h2 className="text-2xl md:text-3xl font-bold text-[#7a6c00]">
        {val.to((v) => Math.floor(v).toLocaleString())}
      </animated.h2>
      <p className="mt-1 text-xs md:text-sm tracking-wide uppercase text-[#B68F00]">
        {label}
      </p>
    </div>
  );
}

function Milestone() {
  return (
    <section className="py-12 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#D4AF37] mb-10">
          What We've Achieved
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Milestone;
