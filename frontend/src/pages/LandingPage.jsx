import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { 
  FaMapMarkerAlt, 
  FaCamera, 
  FaChartLine, 
  FaUsers, 
  FaMobileAlt,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaPlay,
  FaStar,
  FaQuoteLeft,
  FaHeart,
  FaThumbsUp,
  FaRocket
} from 'react-icons/fa';
import '../style/LandingPage.css';

const LandingPage = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stats, setStats] = useState({
    reportsSubmitted: 0,
    issuesResolved: 0,
    activeUsers: 0,
    citiesServed: 0
  });

  // Animated counter effect
  useEffect(() => {
    const targetStats = {
      reportsSubmitted: 1250,
      issuesResolved: 890,
      activeUsers: 450,
      citiesServed: 25
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setStats({
        reportsSubmitted: Math.floor(targetStats.reportsSubmitted * progress),
        issuesResolved: Math.floor(targetStats.issuesResolved * progress),
        activeUsers: Math.floor(targetStats.activeUsers * progress),
        citiesServed: Math.floor(targetStats.citiesServed * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);


  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-blue-600" />,
      title: "Location-Based Reporting",
      description: "Pin exact locations on interactive maps for precise issue tracking"
    },
    {
      icon: <FaCamera className="text-3xl text-green-600" />,
      title: "Photo & Video Evidence",
      description: "Upload photos and videos to provide clear evidence of issues"
    },
    {
      icon: <FaChartLine className="text-3xl text-purple-600" />,
      title: "Real-Time Tracking",
      description: "Monitor the status of your reports from submission to resolution"
    },
    {
      icon: <FaUsers className="text-3xl text-orange-600" />,
      title: "Community Driven",
      description: "Join thousands of citizens working together to improve their cities"
    },
    {
      icon: <FaMobileAlt className="text-3xl text-red-600" />,
      title: "Mobile Friendly",
      description: "Report issues on-the-go with our responsive mobile interface"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-indigo-600" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Activist",
      city: "New York",
      content: "CityCare has transformed how we report issues in our neighborhood. The response time has improved dramatically!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Local Business Owner",
      city: "San Francisco",
      content: "I've reported 15 issues this year and 12 have been resolved. The tracking system keeps me informed every step of the way.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Parent",
      city: "Chicago",
      content: "Finally, a platform that makes it easy to report safety issues around schools. My kids' safety matters!",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Senior Citizen",
      city: "Boston",
      content: "As someone who's lived here for 40 years, I've never seen such efficient issue resolution. CityCare is a game-changer!",
      rating: 5
    },
    {
      name: "Lisa Park",
      role: "Environmental Advocate",
      city: "Seattle",
      content: "The photo upload feature makes it so easy to document environmental issues. Our city is getting cleaner every day!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Tech Professional",
      city: "Austin",
      content: "The mobile app is incredibly user-friendly. I can report issues while walking to work. It's that simple!",
      rating: 5
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Create your account in seconds with secure authentication"
    },
    {
      number: "02",
      title: "Report Issue",
      description: "Take photos, add location, and describe the problem"
    },
    {
      number: "03",
      title: "Track Progress",
      description: "Monitor your report status and get updates from city officials"
    },
    {
      number: "04",
      title: "See Results",
      description: "Watch your city improve as issues get resolved"
    }
  ];

  return (
    <div className="landing-page-container bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="flex justify-between items-center" style={{ height: '64px' }}>
            <div className="flex items-center" style={{ gap: '8px' }}>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <FaMapMarkerAlt className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-gray-900">CityCare</span>
            </div>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" style={{ padding: '8px 24px' }}>
                    Get Started
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  to="/" 
                  className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  style={{ padding: '8px 24px' }}
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto" style={{ padding: '80px 16px' }}>
          <div className="text-center">
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-gray-900 text-center" style={{ marginBottom: '24px' }}>
              Make Your City
              <span className="gradient-text"> Better</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto text-center" style={{ marginBottom: '32px' }}>
              Join thousands of citizens using CityCare to report issues, track progress, and build stronger communities together.
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row justify-center items-center" style={{ gap: '16px' }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-primary bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg" style={{ padding: '16px 32px' }}>
                    Start Reporting Issues
                    <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  to="/report-new-issue"
                  className="btn-primary bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  style={{ padding: '16px 32px' }}
                >
                  Report New Issue
                  <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn-primary bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg" style={{ padding: '16px 32px' }}>
                    Report New Issue
                    <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                  </button>
                </SignInButton>
              </SignedOut>

            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-element absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-50"></div>
        <div className="floating-element absolute top-40 right-20 w-16 h-16 bg-green-100 rounded-full opacity-50"></div>
        <div className="floating-element absolute bottom-20 left-1/4 w-12 h-12 bg-purple-100 rounded-full opacity-50"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-white" style={{ padding: '64px 0' }}>
        <div className="max-w-7xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center" style={{ gap: '32px' }}>
            <div className="text-center">
              <div className="stat-number stat-animate text-4xl font-bold text-blue-600" style={{ marginBottom: '8px' }}>{stats.reportsSubmitted.toLocaleString()}+</div>
              <div className="text-gray-600">Reports Submitted</div>
            </div>
            <div className="text-center">
              <div className="stat-number stat-animate text-4xl font-bold text-green-600" style={{ marginBottom: '8px' }}>{stats.issuesResolved.toLocaleString()}+</div>
              <div className="text-gray-600">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="stat-number stat-animate text-4xl font-bold text-purple-600" style={{ marginBottom: '8px' }}>{stats.activeUsers.toLocaleString()}+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="stat-number stat-animate text-4xl font-bold text-orange-600" style={{ marginBottom: '8px' }}>{stats.citiesServed}+</div>
              <div className="text-gray-600">Cities Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50" style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginBottom: '16px' }}>Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
              Everything you need to report issues and track their resolution in your city
            </p>
            <SignedIn>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6 max-w-2xl mx-auto">
                <p className="text-green-800 text-sm text-center">
                  <FaCheckCircle className="inline-block mr-2" />
                  You're signed in! Access all features including reporting and dashboard
                </p>
              </div>
            </SignedIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center" style={{ gap: '32px' }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="feature-card bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ padding: '32px' }}
              >
                <div className="text-center" style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 text-center" style={{ marginBottom: '12px' }}>{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white" style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 className="text-4xl font-bold text-gray-900 text-center" style={{ marginBottom: '16px' }}>How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center">
              Get started in minutes and make a difference in your community
            </p>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center" style={{ gap: '32px' }}>
            {steps.map((step, index) => (
              <div key={index} className="text-center step-content">
                <div className="step-number w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto" style={{ marginBottom: '16px' }}>
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center" style={{ marginBottom: '12px' }}>{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600" style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto text-center" style={{ padding: '0 16px' }}>
          <h2 className="text-4xl font-bold text-white text-center" style={{ marginBottom: '64px' }}>What Citizens Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '32px' }}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card rounded-2xl"
                style={{ padding: '32px' }}
              >
                <FaQuoteLeft className="text-white text-3xl mx-auto text-center" style={{ marginBottom: '20px' }} />
                <p className="testimonial-quote text-lg text-white text-center" style={{ marginBottom: '20px' }}>
                  {testimonial.content}
                </p>
                <div className="testimonial-stars" style={{ marginBottom: '16px' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="star text-yellow-400 text-lg" />
                  ))}
                </div>
                <div className="text-white text-center">
                  <div className="font-semibold text-lg" style={{ marginBottom: '4px' }}>{testimonial.name}</div>
                  <div className="text-white/80 text-sm">{testimonial.role} • {testimonial.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 cta-section" style={{ padding: '80px 0' }}>
        <div className="max-w-4xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="cta-content">
            <h2 className="text-4xl font-bold text-white text-center" style={{ marginBottom: '24px' }}>
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 text-center max-w-2xl mx-auto" style={{ marginBottom: '32px' }}>
              Join thousands of citizens who are already improving their communities with CityCare
            </p>
            <div className="cta-button-container">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="cta-button btn-primary glow-effect bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg" style={{ padding: '16px 32px' }}>
                    Get Started Today
                    <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link 
                  to="/report-new-issue"
                  className="cta-button btn-primary glow-effect bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
                  style={{ padding: '16px 32px' }}
                >
                  Report Your First Issue
                  <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="cta-button btn-primary glow-effect bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg" style={{ padding: '16px 32px' }}>
                    Report Your First Issue
                    <FaArrowRight className="inline-block" style={{ marginLeft: '8px' }} />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800" style={{ padding: '48px 0' }}>
        <div className="max-w-7xl mx-auto" style={{ padding: '0 16px' }}>
          <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '32px' }}>
            <div>
              <div className="flex items-center" style={{ gap: '8px', marginBottom: '16px' }}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold text-white">CityCare</span>
              </div>
              <p className="text-gray-400">
                Empowering citizens to build better communities through civic engagement.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold" style={{ marginBottom: '16px' }}>Features</h3>
              <ul className="text-gray-400" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Issue Reporting</li>
                <li>Progress Tracking</li>
                <li>Photo Uploads</li>
                <li>Location Mapping</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold" style={{ marginBottom: '16px' }}>Support</h3>
              <ul className="text-gray-400" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold" style={{ marginBottom: '16px' }}>Connect</h3>
              <ul className="text-gray-400" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Twitter</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
                <li>Newsletter</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 text-center text-gray-400" style={{ marginTop: '32px', paddingTop: '32px' }}>
            <p>&copy; 2024 CityCare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 z-50"
          style={{ bottom: '32px', right: '32px', padding: '12px' }}
          aria-label="Scroll to top"
        >
          <FaArrowRight className="rotate-[-90deg]" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
