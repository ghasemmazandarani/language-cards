import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Eye, EyeOff, Check, X, Plus, Trash2 } from 'lucide-react';
import { loadCards, saveCards } from '../utils/storage';

// اضافه کردن کتابخانه confetti
const confetti = {
  async run() {
    const confetti = (await import('canvas-confetti')).default;
    const count = 200;
    const defaults = {
      origin: { y: 0 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        scalar: 1.2,
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });

    fire(0.2, {
      spread: 60,
      colors: ['#00ff00', '#0099ff']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#00ff00', '#0099ff']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#FFD700', '#FFA500', '#FF6347']
    });
  }
};

// افزودن استایل برای انیمیشن لرزش
const styles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
  .shake-animation {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
`;

const AddWordForm = ({ onAdd, onClose }) => {
  const [word, setWord] = useState({ title: '', translation: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (word.title && word.translation) {
      onAdd({
        ...word,
        id: Date.now(),
        date: new Date(),
        wrongCount: 0
      });
      setWord({ title: '', translation: '' });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gray-900/95 backdrop-blur-sm shadow-xl border-gray-800">
        <CardContent className="p-6 text-right">
          <h2 className="text-xl font-bold mb-4 text-teal-400">افزودن کلمه جدید</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">کلمه</label>
              <Input
                value={word.title}
                onChange={(e) => setWord({ ...word, title: e.target.value })}
                placeholder="کلمه را وارد کنید"
                className="w-full bg-gray-800 border-gray-700 text-gray-100 focus:border-teal-500 focus:ring-teal-500 text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">ترجمه</label>
              <Input
                value={word.translation}
                onChange={(e) => setWord({ ...word, translation: e.target.value })}
                placeholder="ترجمه را وارد کنید"
                className="w-full bg-gray-800 border-gray-700 text-gray-100 focus:border-teal-500 focus:ring-teal-500 text-right"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">افزودن</Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-teal-700 text-teal-400 hover:bg-teal-950">
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const FlashCards = () => {
  const [cards, setCards] = useState(loadCards());
  const [sortBy, setSortBy] = useState('date');
  const [visibleTranslations, setVisibleTranslations] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shakingCards, setShakingCards] = useState(new Set());

  // اضافه کردن استایل به صفحه
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const sortCards = (type) => {
    setSortBy(type);
    const sortedCards = [...cards].sort((a, b) => {
      if (type === 'date') {
        return new Date(b.date) - new Date(a.date);
      }
      return b.wrongCount - a.wrongCount;
    });
    setCards(sortedCards);
  };

  const toggleTranslation = (id) => {
    setVisibleTranslations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAnswer = async (id, isCorrect) => {
    const updatedCards = cards.map(card => 
      card.id === id 
        ? { ...card, wrongCount: isCorrect ? card.wrongCount : card.wrongCount + 1 }
        : card
    );
    setCards(updatedCards);
    saveCards(updatedCards);
    setVisibleTranslations(prev => ({
      ...prev,
      [id]: false
    }));

    if (isCorrect) {
      confetti.run();
    } else {
      // اضافه کردن انیمیشن لرزش برای پاسخ اشتباه
      setShakingCards(prev => new Set(prev).add(id));
      setTimeout(() => {
        setShakingCards(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
    }
  };

  const handleAddCard = (newCard) => {
    const updatedCards = [newCard, ...cards];
    setCards(updatedCards);
    saveCards(updatedCards);
  };

  const handleDeleteCard = (id) => {
    if (window.confirm('آیا از حذف این کلمه اطمینان دارید؟')) {
      const updatedCards = cards.filter(card => card.id !== id);
      setCards(updatedCards);
      saveCards(updatedCards);
      setVisibleTranslations(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.translation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
              کارت‌های آموزشی
            </h1>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="w-full md:w-auto flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white"
            >
              <Plus className="h-4 w-4" />
              افزودن کلمه جدید
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-gray-100 focus:border-teal-500 focus:ring-teal-500 text-right"
            />
            <div className="flex gap-2">
              <Button 
                onClick={() => sortCards('date')}
                variant={sortBy === 'date' ? 'default' : 'outline'}
                className={`flex items-center gap-2 flex-1 sm:flex-none ${
                  sortBy === 'date' 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                    : 'border-teal-700 text-teal-400 hover:bg-teal-950'
                }`}
              >
                <ArrowUpDown className="h-4 w-4 ml-1" />
                جدیدترین
              </Button>
              <Button 
                onClick={() => sortCards('wrongCount')}
                variant={sortBy === 'wrongCount' ? 'default' : 'outline'}
                className={`flex items-center gap-2 flex-1 sm:flex-none ${
                  sortBy === 'wrongCount' 
                    ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                    : 'border-teal-700 text-teal-400 hover:bg-teal-950'
                }`}
              >
                <ArrowUpDown className="h-4 w-4 ml-1" />
                بیشترین اشتباه
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map(card => (
            <Card 
              key={card.id} 
              className={`h-full bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 border-gray-800 ${
                shakingCards.has(card.id) ? 'shake-animation' : ''
              }`}
            >
              <CardContent className="p-6 text-right">
                <div className="flex justify-between items-start mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCard(card.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-950/50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="text-xl font-bold text-teal-400">
                    {card.title}
                  </div>
                </div>
                
                {visibleTranslations[card.id] ? (
                  <div className="space-y-4">
                    <div className="text-lg text-gray-300">{card.translation}</div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAnswer(card.id, true)}
                        variant="outline"
                        className="flex-1 flex items-center gap-2 justify-center border-green-700 text-green-400 hover:bg-green-950"
                      >
                        <Check className="h-4 w-4 ml-1" />
                        درست
                      </Button>
                      <Button
                        onClick={() => handleAnswer(card.id, false)}
                        variant="outline"
                        className="flex-1 flex items-center gap-2 justify-center border-red-700 text-red-400 hover:bg-red-950"
                      >
                        <X className="h-4 w-4 ml-1" />
                        اشتباه
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => toggleTranslation(card.id)}
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center border-teal-700 text-teal-400 hover:bg-teal-950"
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    نمایش ترجمه
                  </Button>
                )}
                
                <div className="mt-4 text-sm text-gray-400 flex justify-between items-center">
                  <span>{new Date(card.date).toLocaleDateString('fa-IR')}</span>
                  <span>تعداد اشتباه: {card.wrongCount}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {showAddForm && (
          <AddWordForm 
            onAdd={handleAddCard} 
            onClose={() => setShowAddForm(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default FlashCards;