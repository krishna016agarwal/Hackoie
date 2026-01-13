
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Landing: React.FC = () => {
  const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?');

  return (
    <div className="min-h-screen text-black bg-[#fcfcfc]">
      {/* Header */}
      <header className="px-10 py-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-black">Hackoie</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-black">
         
          <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full hover:bg-black/90 transition-colors shadow-sm">Log in</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-10 py-16 lg:py-28 grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 bg-lime-custom rounded-full animate-pulse shadow-lime"></span>
            <span className="font-medium text-gray-600">The Future of Hackathon Team Building</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold leading-tight tracking-tighter mb-8 text-black">
            Build the <span className="relative">Ultimate<span className="absolute bottom-4 left-0 w-full h-4 bg-lime-custom/30 -z-10"></span></span> Squard.
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mb-10 leading-relaxed">
            Hackoie is the AI-driven platform where developers connect instantly. Our matching engine pairs you with hackers who complement your skills, background, and ambition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="bg-black text-white px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 group hover:shadow-xl hover:bg-black/90 transition-all">
              Start building teams <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex -space-x-3">
                {['Andrew', 'Sarah', 'Marco'].map((name, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-lime-custom text-xs font-black shadow-md">
                    {getInitial(name)}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">Joined by 2,000+ developers</span>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          {/* Main Card UI based on image */}
          <div className="bg-black rounded-[2.5rem] p-8 lg:p-10 text-white shadow-2xl relative z-10">
             <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-lime-custom rounded-xl shadow-lime"></div>
                <div className="flex gap-2">
                   <div className="w-20 h-1.5 bg-gray-800/60 rounded-full"></div>
                   <div className="w-10 h-1.5 bg-gray-800/60 rounded-full"></div>
                </div>
             </div>
             
             <div className="space-y-6 mb-12">
                {/* Simulated Content Bars (Hackoie Data) */}
                <div className="h-8 bg-gray-900/80 rounded-xl w-[90%] flex items-center px-4">
                  <span className="text-xs font-bold text-lime-custom/80 uppercase tracking-widest">Scanning Hackathon Requirements...</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-800/40 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-800/40 rounded-full w-[95%]"></div>
                  <div className="h-3 bg-gray-800/40 rounded-full w-[70%]"></div>
                </div>
                
                <div className="pt-2">
                   <p className="text-sm text-gray-400 leading-relaxed font-medium">
                     AI Recommendation: Found <span className="text-white">Sarah Jenkins</span> (MIT Senior) with expertise in <span className="text-lime-custom">Rust & Web3</span>. Perfect match for your "DeFi Explorer" project.
                   </p>
                </div>
             </div>

             <div className="flex flex-wrap gap-4 mt-auto">
                <div className="px-5 py-2.5 border border-gray-800 rounded-full text-xs font-bold bg-gray-900/30 flex items-center gap-2">
                  <Sparkles size={12} className="text-lime-custom" />
                  AI Match: 98%
                </div>
                <div className="px-5 py-2.5 border border-gray-800 rounded-full text-xs font-bold bg-gray-900/30">
                  Skills Matched
                </div>
             </div>
          </div>
          
          {/* Background Decorative Blurs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-lime-custom/20 blur-[80px] rounded-full -z-10"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full -z-10"></div>
        </div>
      </section>

      {/* Stats/Feature Highlights */}
      <section className="bg-black text-white py-24 px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-lime-custom/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-lime-custom" />
            </div>
            <h3 className="text-2xl font-bold">AI Scraping</h3>
            <p className="text-gray-400">Paste a hackathon link and we'll automatically extract all details, dates, and requirements using our AI engine.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-lime-custom/20 rounded-2xl flex items-center justify-center">
              <Target className="text-lime-custom" />
            </div>
            <h3 className="text-2xl font-bold">Precision Matching</h3>
            <p className="text-gray-400">Our algorithm prioritizes users who match your specific skill requirements and academic background first.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-lime-custom/20 rounded-2xl flex items-center justify-center">
              <Users className="text-lime-custom" />
            </div>
            <h3 className="text-2xl font-bold">Fast Formation</h3>
            <p className="text-gray-400">Go from idea to full team in minutes. Less time recruiting, more time building pixel-perfect realities.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-10 flex flex-col items-center bg-[#fcfcfc]">
        <h2 className="text-5xl lg:text-7xl font-bold text-center mb-12 max-w-4xl tracking-tighter text-black">
          Ready to build something <span className="text-lime-custom">extraordinary</span> together?
        </h2>
        <Link to="/signup" className="bg-black text-white px-12 py-5 rounded-full font-bold text-xl shadow-lg hover:bg-black/90 hover:scale-105 transition-all flex items-center gap-3">
          Join Hackoie Now <Zap size={20} className="fill-current text-lime-custom" />
        </Link>
      </section>

      {/* Main Black Footer */}
      <footer className="bg-black text-white pt-20 pb-10 px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Zap className="text-black w-6 h-6 fill-current" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">Hackoie</span>
            </div>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Empowering hackers worldwide through AI-driven collaboration. Build teams, win hackathons, change the world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-lime-custom hover:text-black transition-all"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-lime-custom hover:text-black transition-all"><Github size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-lg hover:bg-lime-custom hover:text-black transition-all"><Linkedin size={18} /></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-lime-custom">Product</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Team Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Matcher</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-lime-custom">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hackathon Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-lime-custom">Community</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ambassadors</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-lime-custom">Legal</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <p>© 2024 HACKOIE AI. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <a href="mailto:hello@hackoie.ai" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} /> hello@hackoie.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
