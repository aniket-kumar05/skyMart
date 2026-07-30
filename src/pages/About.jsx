import React from 'react';
import { useNavigate } from 'react-router';
import {
  Zap, ShieldCheck, Truck, Users, Star, ArrowRight
} from 'lucide-react';

/* ── Stats Data ── */
const stats = [
  { icon: <Zap size={20} className="text-[#C8FF00]" />, value: '20K+', label: 'Products' },
  { icon: <Users size={20} className="text-[#C8FF00]" />, value: '50K+', label: 'Happy Customers' },
  { icon: <Star size={20} className="text-[#C8FF00]" />, value: '4.9', label: 'Avg. Rating' },
  { icon: <Truck size={20} className="text-[#C8FF00]" />, value: '99%', label: 'On-time Delivery' },
];

/* ── Values Data ── */
const values = [
  {
    icon: <ShieldCheck size={22} className="text-[#C8FF00]" />,
    title: 'Trust',
    desc: 'Every product is verified for quality and authenticity before listing.',
  },
  {
    icon: <Truck size={22} className="text-[#C8FF00]" />,
    title: 'Speed',
    desc: 'We obsess over delivery times so your orders arrive when promised.',
  },
  {
    icon: <Users size={22} className="text-[#C8FF00]" />,
    title: 'Community',
    desc: 'Built around real customer feedback, not just business metrics.',
  },
  {
    icon: <Star size={22} className="text-[#C8FF00]" />,
    title: 'Quality',
    desc: 'We curate the best — no filler, no junk, just great products.',
  },
];

/* ── Team Data ── */
const team = [
  { name: 'Aryan Shah', role: 'Founder & CEO', initial: 'A', color: '#C8FF00', textColor: '#0D0D0D' },
  { name: 'Priya Mehta', role: 'Head of Product', initial: 'P', color: '#3b82f6', textColor: '#fff' },
  { name: 'Rohan Verma', role: 'Lead Engineer', initial: 'R', color: '#a855f7', textColor: '#fff' },
  { name: 'Sneha Kapoor', role: 'Design Director', initial: 'S', color: '#ec4899', textColor: '#fff' },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">

      {/* ── Hero Section ── */}
      <section className="py-20 px-6 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Brand Icon */}
        <div className="w-16 h-16 bg-[#C8FF00] rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(200,255,0,0.25)] mb-8">
          <Zap size={32} color="#0D0D0D" fill="#0D0D0D" />
        </div>

        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
          About <span className="text-[#C8FF00]">SkyMart</span>
        </h1>

        <p className="text-[#7A7A7A] text-base md:text-lg leading-relaxed max-w-xl">
          SkyMart is a next-generation e-commerce platform built to make online
          shopping fast, fair, and enjoyable — for everyone.
        </p>
      </section>

      {/* ── Stats Row ── */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#272727] rounded-2xl p-6 flex flex-col items-start gap-3 hover:border-[#C8FF00]/40 transition-all"
            >
              <div className="w-9 h-9 bg-[#C8FF00]/10 rounded-xl flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-[#7A7A7A] font-medium mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <div className="bg-[#141414] border border-[#272727] rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <div className="space-y-4 text-[#9A9A9A] text-sm md:text-base leading-relaxed">
            <p>
              SkyMart started in 2022 as a small side project — two engineers tired of bloated,
              slow e-commerce experiences. We asked ourselves: what if shopping online was actually{' '}
              <em className="text-white font-medium not-italic">enjoyable</em>?
            </p>
            <p>
              Three years later, SkyMart serves over 50,000 customers across the country. We stock
              electronics, fashion, jewelry, and everyday essentials — all at prices that don't
              require a second mortgage.
            </p>
            <p>
              We're still the same team at heart: obsessed with speed, transparency, and making you
              feel good about every purchase you make here.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Stand For ── */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">What We Stand For</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((val, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#272727] rounded-2xl p-6 flex gap-4 hover:border-[#C8FF00]/40 transition-all group"
            >
              <div className="w-10 h-10 bg-[#C8FF00]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C8FF00]/20 transition-colors">
                {val.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">{val.title}</h3>
                <p className="text-[#7A7A7A] text-sm leading-relaxed">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Meet The Team ── */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#272727] rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-[#C8FF00]/40 transition-all"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg"
                style={{ backgroundColor: member.color, color: member.textColor }}
              >
                {member.initial}
              </div>
              <div>
                <p className="text-white font-bold text-sm">{member.name}</p>
                <p className="text-[#7A7A7A] text-xs mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="px-6 max-w-5xl mx-auto mb-16">
        <div className="bg-[#141414] border border-[#272727] rounded-3xl p-10 md:p-14 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Ready to shop?</h2>
          <p className="text-[#7A7A7A] text-sm md:text-base mb-8">
            Explore thousands of products at unbeatable prices.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 bg-[#C8FF00] hover:bg-[#a8d900] text-[#0D0D0D] font-bold text-base px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_6px_24px_rgba(200,255,0,0.25)] hover:-translate-y-0.5 active:scale-95 cursor-pointer border-none"
          >
            Browse Products <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E1E1E] py-8 text-center">
        <p className="text-3xl font-black text-[#C8FF00] mb-2">SkyMart</p>
        <p className="text-[#5A5A5A] text-xs">
          © 2025 SkyMart • Built with React + Redux + TanStack Query
        </p>
      </footer>

    </div>
  );
};

export default About;
