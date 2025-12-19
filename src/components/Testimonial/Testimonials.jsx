import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
 
export default function Testimonials() {
  const testimonials = [
    {
      name: "Ramanpreet Singh",
      role: "Zirapur",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramanpreet",
      text: "I subscribed to their monthly plan (and it's the best decision I made for my health). I go to the gym 6 days a week, do yoga their own equipment. I will lose it through job My car has lost its place since I started and I'm not worrying about anything. True professionals with consistent results.",
      rating: 4
    },
    {
      name: "Simran Kaur",
      role: "Mohali",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Simran",
      text: "The Premium Plus which was outstanding. They cleaned the bathrooms, kitchen living room and even removed tough water stains from my windows. I honestly didn't expect this level of attention to detail for my doorknob. If you're looking for reliability and personality at once.",
      rating: 5
    },
    {
      name: "Harpreet Kaur",
      role: "Ludhiana",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harpreet",
      text: "Amazing service! The team was professional and thorough. They went above and beyond my expectations. I highly recommend their services to anyone looking for quality work.",
      rating: 3
    },
    {
      name: "Gurpreet Singh",
      role: "Chandigarh",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gurpreet",
      text: "Best decision I made this year. The results speak for themselves. Professional, reliable, and worth every penny. Will definitely continue using their services.",
      rating: 5
    }
  ];
 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };
 
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
 
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + cardsToShow >= testimonials.length ? 0 : prev + 1
    );
  };
 
  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - cardsToShow) : prev - 1
    );
  };
 
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + cardsToShow);
 
  if (visibleTestimonials.length < cardsToShow) {
    visibleTestimonials.push(...testimonials.slice(0, cardsToShow - visibleTestimonials.length));
  }
 
  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '48px 24px',
    },
    innerContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    title: {
      fontSize: '52px',
      fontWeight: 'bold',
      color: '#103B65',
      marginBottom: '40px',
      textAlign: 'left',
    },
    sliderWrapper: {
      position: 'relative',
    },
    cardsContainer: {
      overflow: 'hidden',
    },
    cardsInner: {
      display: 'flex',
      gap: '20px',
      transition: 'transform 0.3s ease',
    },
   card: {
  backgroundImage: ` url('/images/test-bg.png')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  borderRadius: "8px",
  padding: "24px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  flexShrink: 0,
  width:
    cardsToShow === 1
      ? "100%"
      : cardsToShow === 2
      ? "calc(50% - 10px)"
      : "calc(33.333% - 14px)",
},
 
    profileSection: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '16px',
    },
    profileImage: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      backgroundColor: '#475569',
    },
    profileName: {
      fontFamily: 'Reddit Sans, sans-serif',
      color: '#FFFBEFB2',
      fontWeight: '800',
      fontSize: '20px',
      margin: 0,
    },
    profileRole: {
      fontFamily: 'Reddit Sans, sans-serif',
      color: '#FFFBEFB2',
      fontWeight: '400',
      fontSize: '20px',
      margin: 0,
      marginTop: '2px',
    },
    testimonialText: {
      fontFamily: 'Lexend, sans-serif',
      fontWeight: '300',
      color: '#FFFBEFB2',
      lineHeight: '1.625',
      marginBottom: '20px',
      fontSize: '16px',
      textAlign: 'center',
      minHeight: '180px',
    },
    starsContainer: {
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
    },
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      borderRadius: '50%',
      padding: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    prevButton: {
      left: '-16px',
    },
    nextButton: {
      right: '-16px',
    },
    dotsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '24px',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      padding: 0,
    },
    activeDot: {
      backgroundColor: '#1e293b',
    },
    inactiveDot: {
      backgroundColor: '#cbd5e1',
    },
    prod:{
      lineHeight:'1.2',
    },
    line:{
      width: '50%',
      height: '1px',
      backgroundColor: '#FFFBEFB2',
      margin: '24px auto',
    }
   
  };
 
  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <h1 style={styles.title}>Testimonials</h1>
       
        <div style={styles.sliderWrapper}>
          <div style={styles.cardsContainer}>
            <div style={styles.cardsInner}>
              {visibleTestimonials.map((testimonial, index) => (
                <div key={`${currentIndex}-${index}`} style={styles.card}>
                  <div style={styles.profileSection}>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={styles.profileImage}
                    />
                    <div style={styles.prod}>
                      <h3 style={styles.profileName}>{testimonial.name}</h3>
                      <p style={styles.profileRole}>{testimonial.role}</p>
                    </div>
                  </div>
                 
                  <p style={styles.testimonialText}>"{testimonial.text}"</p>
                 
                  <div style={styles.line}></div>
                 
                  <div style={styles.starsContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        style={{ width: '16px', height: '16px' }}
                        fill={i < testimonial.rating ? "#facc15" : "#d1d5db"}
                        color={i < testimonial.rating ? "#facc15" : "#d1d5db"}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          <button
            onClick={prevSlide}
            style={{ ...styles.navButton, ...styles.prevButton }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            aria-label="Previous testimonial"
          >
            <ChevronLeft style={{ width: '24px', height: '24px', color: '#1e293b' }} />
          </button>
         
          <button
            onClick={nextSlide}
            style={{ ...styles.navButton, ...styles.nextButton }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            aria-label="Next testimonial"
          >
            <ChevronRight style={{ width: '24px', height: '24px', color: '#1e293b' }} />
          </button>
 
          <div style={styles.dotsContainer}>
            {Array.from({ length: Math.ceil(testimonials.length / cardsToShow) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx * cardsToShow)}
                style={{
                  ...styles.dot,
                  ...(Math.floor(currentIndex / cardsToShow) === idx
                    ? styles.activeDot
                    : styles.inactiveDot)
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}