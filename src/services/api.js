const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('learni_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMsg = 'API request failed';
    try {
      const data = await res.json();
      errorMsg = data.detail || data.message || errorMsg;
    } catch (e) {
      // JSON parse error
    }
    throw new Error(errorMsg);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  // Auth
  register: async (email, password, full_name, role = 'student') => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, role })
    });
    return handleResponse(res);
  },

  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Courses & Search & Filter
  getCourses: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.level && params.level !== 'All Levels') query.append('level', params.level);
    if (params.min_price) query.append('min_price', params.min_price);
    if (params.max_price) query.append('max_price', params.max_price);
    if (params.sort_by) query.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE}/courses?${query.toString()}`);
    return handleResponse(res);
  },

  getCourseDetail: async (courseId) => {
    const res = await fetch(`${API_BASE}/courses/${courseId}`);
    return handleResponse(res);
  },

  createCourse: async (courseData) => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(courseData)
    });
    return handleResponse(res);
  },

  updateCourse: async (courseId, courseData) => {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(courseData)
    });
    return handleResponse(res);
  },

  deleteCourse: async (courseId) => {
    const res = await fetch(`${API_BASE}/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  addReview: async (courseId, rating, comment) => {
    const res = await fetch(`${API_BASE}/courses/${courseId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ rating, comment })
    });
    return handleResponse(res);
  },

  // Enrollments & Checkout
  checkEnrollment: async (courseId) => {
    const res = await fetch(`${API_BASE}/enrollments/check/${courseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getMyCourses: async () => {
    const res = await fetch(`${API_BASE}/enrollments/my-courses`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createCheckoutSession: async (courseId) => {
    const res = await fetch(`${API_BASE}/enrollments/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ course_id: courseId })
    });
    return handleResponse(res);
  },

  confirmPayment: async (courseId) => {
    const res = await fetch(`${API_BASE}/enrollments/confirm-payment?course_id=${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Progress
  getCourseProgress: async (courseId) => {
    const res = await fetch(`${API_BASE}/progress/${courseId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  toggleProgress: async (courseId, lessonId, completed) => {
    const res = await fetch(`${API_BASE}/progress/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, completed })
    });
    return handleResponse(res);
  },

  // Notes
  getLessonNote: async (courseId, lessonId) => {
    const res = await fetch(`${API_BASE}/notes/${courseId}/${lessonId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getUserNotes: async () => {
    const res = await fetch(`${API_BASE}/notes/user/all`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  saveLessonNote: async (courseId, lessonId, noteText) => {
    const res = await fetch(`${API_BASE}/notes/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ course_id: courseId, lesson_id: lessonId, note_text: noteText })
    });
    return handleResponse(res);
  },

  deleteLessonNote: async (noteId) => {
    const res = await fetch(`${API_BASE}/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Certificates
  getUserCertificates: async () => {
    const res = await fetch(`${API_BASE}/certificates`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  generateCertificate: async (courseId) => {
    const res = await fetch(`${API_BASE}/certificates/generate/${courseId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  verifyCertificate: async (code) => {
    const res = await fetch(`${API_BASE}/certificates/verify/${code}`);
    return handleResponse(res);
  },

  // Admin Stats & Instructors
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getInstructors: async () => {
    const res = await fetch(`${API_BASE}/admin/instructors`);
    return handleResponse(res);
  },

  createInstructor: async (data) => {
    const res = await fetch(`${API_BASE}/admin/instructors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};
