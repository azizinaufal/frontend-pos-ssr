const getRandomColors = ()=>{
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color+=letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const generateRandomColors = (count) => {
    return Array.from({length:count},()=>getRandomColors());
}

export default generateRandomColors;