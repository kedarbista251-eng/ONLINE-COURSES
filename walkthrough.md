# Course Selling & E-Learning Web Application Walkthrough

We have successfully designed and built a full-featured, modern **Course Selling & LMS Platform** web application in React + Vite with dark/light theme support, responsive glassmorphism design, and real-time interactive learning modules.

---

## 🌟 Major Features Built

### 1. 🛍️ Course Storefront & Catalog ([App.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/App.jsx))
- **Hero Showcase**: High-impact promotional hero with search bar, key platform trust statistics, and animated gradient typography.
- **Search & Category Filtering**: Real-time search filtering across titles, descriptions, and technology tags, along with category pill filters (*Development*, *Artificial Intelligence*, *Design*, *DevOps & Cloud*).
- **Course Cards**: Displaying price, discount tags, best-seller badges, instructor avatar, student counts, duration, and star ratings ([CourseCard.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/CourseCard.jsx)).

### 2. 📖 Comprehensive Course Detail View ([CourseDetail.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/CourseDetail.jsx))
- **Sticky Pricing Card**: Prominent pricing, discount tag, free preview video trigger, and lifetime access features.
- **Interactive Syllabus Breakdown**: Expandable section accordions listing lesson titles, video durations, and preview locks.
- **Tabbed Overview**: Switch between *Overview*, *What You'll Learn*, *Curriculum*, *Instructor Bio*, and *Student Reviews*.

### 3. 💳 Secure Checkout & Payment Modal ([CheckoutModal.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/CheckoutModal.jsx))
- **Payment Gateway Selector**: Support for Card/Debit and PayPal/UPI payment options.
- **Promo Code Calculator**: Interactive coupon code validator (Try `DEV2026` or `WELCOME` for instant $20 discount).
- **Instant Enrollment Simulation**: Animated SSL payment processing leading directly into the course player.

### 4. 📺 Interactive Video LMS Player ([LessonPlayer.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/LessonPlayer.jsx))
- **Video Viewport & Playlist**: HTML5 Video player with module sidebar playlist and automatic progress calculation.
- **Time-stamped Notes**: Add custom notes with video timestamps during lessons.
- **Interactive Quiz Engine**: Test student comprehension with real-time feedback.

### 5. 🎓 Student Dashboard & Verified Certificates ([StudentDashboard.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/StudentDashboard.jsx) & [CertificateModal.jsx](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/components/CertificateModal.jsx))
- **Learning Progress Tracker**: Track completed modules and resume active courses.
- **Printable Certificate**: Official completion seal with unique certificate ID, issue date, instructor signature, and PDF print action.

---

## 🎨 Design & Aesthetics ([index.css](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/src/index.css))
- **Glassmorphism UI**: Backdrop blur cards and navigation elements.
- **Dark/Light Theme Toggle**: Seamless theme switching with custom design variables.
- **Custom Typography**: Powered by *Plus Jakarta Sans* and *Outfit* fonts.

---

## 🚀 How to Run Locally

```bash
# Development Server
npm run dev

# Production Build
npm run build
```
