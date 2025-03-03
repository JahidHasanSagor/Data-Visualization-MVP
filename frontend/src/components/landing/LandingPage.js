import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../../assets/styles/components/landing.css';
import Navbar from '../layout/Navbar';

const LandingPage = () => {
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);

    useEffect(() => {
        // Initialize charts for dashboard preview
        initCharts();
        
        // Setup other effects
        const cleanupTestimonials = setupTestimonialCarousel();
        setupPricingToggle();
        setupMobileMenu();
        setupTiltEffect();
        setupRippleEffect();

        // Cleanup function
        return () => {
            // Destroy chart instances
            if (chart1Ref.current) {
                chart1Ref.current.destroy();
            }
            if (chart2Ref.current) {
                chart2Ref.current.destroy();
            }
            // Cleanup other effects
            cleanupTestimonials();
        };
    }, []);

    const initCharts = () => {
        // Line chart
        const ctx1 = document.getElementById('lineChart')?.getContext('2d');
        if (ctx1) {
            // Destroy existing chart if it exists
            const existingChart1 = Chart.getChart(ctx1.canvas);
            if (existingChart1) {
                existingChart1.destroy();
            }
            
            new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Growth',
                        data: [30, 45, 35, 50, 40, 60],
                        borderColor: '#8B5CF6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        }

        // Bar chart
        const ctx2 = document.getElementById('barChart')?.getContext('2d');
        if (ctx2) {
            // Destroy existing chart if it exists
            const existingChart2 = Chart.getChart(ctx2.canvas);
            if (existingChart2) {
                existingChart2.destroy();
            }

            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                        label: 'Revenue',
                        data: [65, 85, 55, 75, 45],
                        backgroundColor: [
                            '#EC4899',
                            '#8B5CF6',
                            '#EC4899',
                            '#8B5CF6',
                            '#EC4899'
                        ],
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        }
    };

    const setupTestimonialCarousel = () => {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.testimonial-dots span');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        const totalSlides = slides.length;

        const showSlide = (index) => {
            // Remove all classes first
            slides.forEach(slide => {
                slide.classList.remove('active', 'prev', 'next');
            });
            
            // Calculate prev and next indices
            const prevIndex = (index - 1 + totalSlides) % totalSlides;
            const nextIndex = (index + 1) % totalSlides;
            
            // Add appropriate classes
            slides[prevIndex].classList.add('prev');
            slides[index].classList.add('active');
            slides[nextIndex].classList.add('next');
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        };

        // Event listeners
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', prevSlide);
            nextBtn.addEventListener('click', nextSlide);
        }

        // Add click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-advance slides every 5 seconds
        const interval = setInterval(nextSlide, 5000);

        // Show first slide initially
        showSlide(0);

        // Cleanup function
        return () => {
            clearInterval(interval);
            if (prevBtn && nextBtn) {
                prevBtn.removeEventListener('click', prevSlide);
                nextBtn.removeEventListener('click', nextSlide);
            }
            dots.forEach((dot, index) => {
                dot.removeEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
        };
    };

    const setupPricingToggle = () => {
        const toggle = document.getElementById('pricing-toggle');
        const monthlyPrices = document.querySelectorAll('.price.monthly');
        const annualPrices = document.querySelectorAll('.price.annual');

        const updatePrices = () => {
            const isAnnual = toggle.checked;
            monthlyPrices.forEach(price => {
                price.style.display = isAnnual ? 'none' : 'inline';
            });
            annualPrices.forEach(price => {
                price.style.display = isAnnual ? 'inline' : 'none';
            });
        };

        if (toggle) {
            toggle.addEventListener('change', updatePrices);
            updatePrices(); // Initial state
        }
    };

    const setupMobileMenu = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks?.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    };

    const setupTiltEffect = () => {
        const cards = document.querySelectorAll('.pricing-card');
        
        const handleMouseMove = (e) => {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        
        const resetTilt = (e) => {
            e.currentTarget.style.transform = 'none';
        };
        
        cards.forEach(card => {
            card.addEventListener('mousemove', handleMouseMove);
            card.addEventListener('mouseleave', resetTilt);
        });
    };

    const setupRippleEffect = () => {
        const buttons = document.querySelectorAll('.btn-neumorphic');
        
        const createRipple = (e) => {
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        };
        
        buttons.forEach(button => {
            button.addEventListener('click', createRipple);
        });
    };

    return (
        <div className="homepage">
            <Navbar isDashboard={false} />
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">Unleash Your Data's Story</h1>
                        <p className="hero-subtitle">Create stunning marketing reports in minutes with drag-and-drop dashboards.</p>
                        <div className="hero-cta">
                            <a href="/signup" className="btn-neumorphic">Start Free Trial</a>
                            <a href="#demo" className="btn-text">
                                <i className="fas fa-play-circle"></i>
                                Watch Demo
                            </a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="dashboard-preview">
                            <div className="dashboard-header">
                                <div className="dashboard-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <div className="dashboard-title">Marketing Dashboard</div>
                            </div>
                            <div className="dashboard-body">
                                <div className="dashboard-widget">
                                    <canvas id="lineChart"></canvas>
                                </div>
                                <div className="dashboard-widget">
                                    <canvas id="barChart"></canvas>
                                </div>
                                <div className="dashboard-widget">
                                    <div className="kpi-preview">
                                        <div className="kpi-value">2,547</div>
                                        <div className="kpi-label">Conversions</div>
                                        <div className="kpi-trend">+12.5%</div>
                                    </div>
                                </div>
                                <div className="dashboard-widget">
                                    <div className="kpi-preview">
                                        <div className="kpi-value">$12,840</div>
                                        <div className="kpi-label">Revenue</div>
                                        <div className="kpi-trend">+8.3%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-wave">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
                        <path fill="#f8f9fc" fillOpacity="1" d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,112C672,107,768,117,864,128C960,139,1056,149,1152,144C1248,139,1344,117,1392,106.7L1440,96L1440,200L1392,200C1344,200,1248,200,1152,200C1056,200,960,200,864,200C768,200,672,200,576,200C480,200,384,200,288,200C192,200,96,200,48,200L0,200Z"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Powerful Features, Simplified</h2>
                        <p>Everything you need to create beautiful marketing reports and dashboards</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card glassmorphic tilt">
                            <div className="feature-icon">
                                <i className="fas fa-grip-horizontal"></i>
                            </div>
                            <h3>Drag & Drop Dashboards</h3>
                            <p>Build custom dashboards in minutes with our intuitive drag-and-drop interface.</p>
                        </div>
                        <div className="feature-card glassmorphic tilt">
                            <div className="feature-icon">
                                <i className="fas fa-table"></i>
                            </div>
                            <h3>Ready-Made Templates</h3>
                            <p>Choose from dozens of pre-built templates for SEO, PPC, social media, and more.</p>
                        </div>
                        <div className="feature-card glassmorphic tilt">
                            <div className="feature-icon">
                                <i className="fas fa-plug"></i>
                            </div>
                            <h3>All Your Data, One Place</h3>
                            <p>Connect all your marketing platforms and visualize your data in one unified dashboard.</p>
                            <div className="integrations-grid">
                                <div className="integration-logo">
                                    <i className="fab fa-google"></i>
                                </div>
                                <div className="integration-logo">
                                    <i className="fab fa-facebook"></i>
                                </div>
                                <div className="integration-logo">
                                    <i className="fab fa-instagram"></i>
                                </div>
                                <div className="integration-logo">
                                    <i className="fab fa-linkedin"></i>
                                </div>
                                <div className="integration-logo">
                                    <i className="fab fa-twitter"></i>
                                </div>
                                <div className="integration-logo">
                                    <i className="fab fa-tiktok"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>How ReportVibe Works</h2>
                        <p>Three simple steps to transform your marketing reporting</p>
                    </div>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Connect Your Data</h3>
                                <p>Integrate with 40+ marketing platforms with just a few clicks.</p>
                            </div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Customize Your Dashboard</h3>
                                <p>Drag and drop widgets or use our ready-made templates.</p>
                            </div>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Share & Automate</h3>
                                <p>Schedule automated reports and share with your team or clients.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Trusted by 10,000+ Marketers</h2>
                        <p>See what our customers are saying about ReportVibe</p>
                    </div>
                    <div className="testimonials-carousel">
                        <div className="testimonial-card active">
                            <div className="testimonial-content">
                                <p>"The white-labeling feature is a game-changer for our agency. Our clients love the professional reports with our branding, and we love how easy it is to set up."</p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/static/img/avatar-2.jpg" alt="Michael Chen" className="author-avatar" />
                                <div className="author-info">
                                    <h4>Michael Chen</h4>
                                    <p>CEO, DigitalGrowth Agency</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"ReportVibe has transformed how we present data to our clients. The drag-and-drop interface is intuitive, and the reports look stunning. It's saved us hours every week!"</p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/static/img/avatar-1.jpg" alt="Sarah Johnson" className="author-avatar" />
                                <div className="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Marketing Director, TechCorp</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"I've tried many reporting tools, but ReportVibe stands out with its beautiful UI and powerful customization options. It's the perfect balance of simplicity and flexibility."</p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/static/img/avatar-3.jpg" alt="Emma Rodriguez" className="author-avatar" />
                                <div className="author-info">
                                    <h4>Emma Rodriguez</h4>
                                    <p>Performance Marketing Lead, E-commerce Plus</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-controls">
                        <button className="testimonial-prev"><i className="fas fa-chevron-left"></i></button>
                        <div className="testimonial-dots">
                            <span className="active"></span>
                            <span></span>
                            <span></span>
                        </div>
                        <button className="testimonial-next"><i className="fas fa-chevron-right"></i></button>
                    </div>
                    <div className="clients-logos">
                        <div className="client-logo">
                            <img src="/static/img/google-logo.png" alt="Google" />
                        </div>
                        <div className="client-logo">
                            <img src="/static/img/hubspot-logo.png" alt="HubSpot" />
                        </div>
                        <div className="client-logo">
                            <img src="/static/img/shopify-logo.png" alt="Shopify" />
                        </div>
                        <div className="client-logo">
                            <img src="/static/img/salesforce-logo.png" alt="Salesforce" />
                        </div>
                        <div className="client-logo">
                            <img src="/static/img/adobe-logo.png" alt="Adobe" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Simple, Transparent Pricing</h2>
                        <p>Choose the plan that fits your needs</p>
                    </div>
                    <div className="pricing-toggle">
                        <span>Monthly</span>
                        <label className="switch">
                            <input type="checkbox" id="pricing-toggle" />
                            <span className="slider round"></span>
                        </label>
                        <span>Annual <span className="save-badge">Save 20%</span></span>
                    </div>
                    <div className="pricing-cards">
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Starter</h3>
                                <div className="pricing-price">
                                    <span className="price monthly">$49</span>
                                    <span className="price annual">$39</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <div className="pricing-features">
                                <ul>
                                    <li><i className="fas fa-check"></i> 5 Dashboards</li>
                                    <li><i className="fas fa-check"></i> 10 Data Sources</li>
                                    <li><i className="fas fa-check"></i> Daily Data Refresh</li>
                                    <li><i className="fas fa-check"></i> Email Reports</li>
                                    <li><i className="fas fa-check"></i> Basic Templates</li>
                                    <li className="disabled"><i className="fas fa-times"></i> White Labeling</li>
                                    <li className="disabled"><i className="fas fa-times"></i> API Access</li>
                                </ul>
                            </div>
                            <div className="pricing-cta">
                                <a href="#cta" className="btn-neumorphic secondary">Get Started</a>
                            </div>
                        </div>
                        <div className="pricing-card popular">
                            <div className="popular-badge">Most Popular</div>
                            <div className="pricing-header">
                                <h3>Professional</h3>
                                <div className="pricing-price">
                                    <span className="price monthly">$99</span>
                                    <span className="price annual">$79</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <div className="pricing-features">
                                <ul>
                                    <li><i className="fas fa-check"></i> 20 Dashboards</li>
                                    <li><i className="fas fa-check"></i> 30 Data Sources</li>
                                    <li><i className="fas fa-check"></i> Hourly Data Refresh</li>
                                    <li><i className="fas fa-check"></i> Email & PDF Reports</li>
                                    <li><i className="fas fa-check"></i> All Templates</li>
                                    <li><i className="fas fa-check"></i> White Labeling</li>
                                    <li className="disabled"><i className="fas fa-times"></i> API Access</li>
                                </ul>
                            </div>
                            <div className="pricing-cta">
                                <a href="#cta" className="btn-neumorphic primary">Get Started</a>
                            </div>
                        </div>
                        <div className="pricing-card">
                            <div className="pricing-header">
                                <h3>Enterprise</h3>
                                <div className="pricing-price">
                                    <span className="price monthly">$249</span>
                                    <span className="price annual">$199</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <div className="pricing-features">
                                <ul>
                                    <li><i className="fas fa-check"></i> Unlimited Dashboards</li>
                                    <li><i className="fas fa-check"></i> All Data Sources</li>
                                    <li><i className="fas fa-check"></i> Real-time Data</li>
                                    <li><i className="fas fa-check"></i> Advanced Reports</li>
                                    <li><i className="fas fa-check"></i> Custom Templates</li>
                                    <li><i className="fas fa-check"></i> White Labeling</li>
                                    <li><i className="fas fa-check"></i> API Access</li>
                                </ul>
                            </div>
                            <div className="pricing-cta">
                                <a href="#cta" className="btn-neumorphic secondary">Get Started</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="cta-section">
                <div className="cta-gradient"></div>
                <div className="container">
                    <h2>Ready to vibe with your data?</h2>
                    <p>Try ReportVibe free for 14 days. No credit card required.</p>
                    <Link to="/login" className="btn-neumorphic large primary pulse">
                        <span>Get Started Now</span>
                        <div className="ripple"></div>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="logo">
                                ReportVibe.
                            </div>
                            <p>Unleash your data's story with beautiful, customizable marketing dashboards.</p>
                            <div className="social-icons">
                                <a href="#"><i className="fab fa-twitter"></i></a>
                                <a href="#"><i className="fab fa-facebook"></i></a>
                                <a href="#"><i className="fab fa-linkedin"></i></a>
                                <a href="#"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="footer-links">
                            <div className="footer-links-column">
                                <h4>Product</h4>
                                <ul>
                                    <li><a href="#features">Features</a></li>
                                    <li><a href="#pricing">Pricing</a></li>
                                </ul>
                            </div>
                            <div className="footer-links-column">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="#blog">Blog</a></li>
                                    <li><a href="#guides">Guides</a></li>
                                    <li><a href="#help">Help Center</a></li>
                                    <li><a href="#webinars">Webinars</a></li>
                                </ul>
                            </div>
                            <div className="footer-links-column">
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="#about">About Us</a></li>
                                    <li><a href="#careers">Careers</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                    <li><a href="#partners">Partners</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 ReportVibe. All rights reserved.</p>
                        <div className="footer-legal">
                            <a href="#privacy">Privacy Policy</a>
                            <a href="#terms">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage; 