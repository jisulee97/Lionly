function moveScrollTop() {
  return (window.onload = () => {
    setTimeout(() => {
      scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  });
}

export default moveScrollTop;
