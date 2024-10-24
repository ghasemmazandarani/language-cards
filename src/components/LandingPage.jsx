import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Book, Brain, Languages } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* Decorative Circle */}
      <div className="absolute -left-1/3 top-0 w-[1000px] h-[1000px] rounded-full bg-teal-500/10 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center justify-between py-8">
          <div className="text-2xl font-bold text-teal-400">Language Cards</div>
          <Button 
            onClick={() => navigate('/cards')} 
            variant="outline"
            className="border-teal-700 text-teal-400 hover:bg-teal-950"
          >
            شروع یادگیری
          </Button>
        </nav>

        <main className="py-16">
          <div className="text-center relative z-10">
            <h1 className="text-5xl font-bold p-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
              یادگیری زبان را آسان کنید
            </h1>
            <p className="text-xl text-gray-400 pb-8 max-w-2xl mx-auto">
              با استفاده از کارت‌های هوشمند، لغات جدید را به راحتی یاد بگیرید و پیشرفت خود را دنبال کنید.
            </p>
            <Button 
              onClick={() => navigate('/cards')} 
              size="lg"
              className="bg-gradient-to-r text-md py-1 from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white"
            >
              شروع رایگان
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-300">
              <Book className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-teal-300">یادگیری آسان</h3>
              <p className="text-gray-400 text-center">
                با استفاده از سیستم کارت‌های هوشمند، لغات را سریع‌تر یاد بگیرید
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-300">
              <Brain className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-teal-300">پیشرفت هوشمند</h3>
              <p className="text-gray-400 text-center">
                سیستم هوشمند ما لغاتی که در آنها ضعیف هستید را بیشتر تکرار می‌کند
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-800 hover:shadow-xl transition-shadow duration-300">
              <Languages className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-teal-300">تنوع زبان‌ها</h3>
              <p className="text-gray-400 text-center">
                امکان یادگیری چندین زبان به صورت همزمان با سیستم هوشمند
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-teal-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-700/10 rounded-full blur-3xl" />
    </div>
  );
};

export default LandingPage;