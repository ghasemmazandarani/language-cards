export const saveCards = (cards) => {
    localStorage.setItem('languageCards', JSON.stringify(cards));
  };
  
  export const loadCards = () => {
    const saved = localStorage.getItem('languageCards');
    return saved ? JSON.parse(saved) : [];
  };