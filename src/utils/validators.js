/**
 * Validation utility functions for Employee Management System
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export const validateMobile = (mobile) => {
  if (!mobile || typeof mobile !== 'string') return false;
  // Accepts standard international formats, digits, dashes, spaces, 10-15 digits
  const cleanNumber = mobile.replace(/[\s\-\(\)\+]/g, '');
  return /^\d{10,15}$/.test(cleanNumber);
};

export const validateEmployeeForm = (values) => {
  const errors = {};

  // Name validation
  if (!values.name || !values.name.trim()) {
    errors.name = 'Full name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (values.name.trim().length > 50) {
    errors.name = 'Name cannot exceed 50 characters';
  }

  // Email validation
  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Please enter a valid email address (e.g. user@company.com)';
  }

  // Mobile validation
  if (!values.mobile || !values.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!validateMobile(values.mobile)) {
    errors.mobile = 'Please enter a valid 10-15 digit mobile number';
  }

  // Department validation
  if (!values.department || !values.department.trim()) {
    errors.department = 'Department is required';
  }

  // Designation validation
  if (!values.designation || !values.designation.trim()) {
    errors.designation = 'Designation/Job Title is required';
  }

  // Joining Date validation
  if (!values.joiningDate) {
    errors.joiningDate = 'Joining date is required';
  } else {
    const selectedDate = new Date(values.joiningDate);
    if (isNaN(selectedDate.getTime())) {
      errors.joiningDate = 'Please select a valid date';
    }
  }

  // Salary validation
  if (values.salary === undefined || values.salary === null || values.salary === '') {
    errors.salary = 'Salary is required';
  } else {
    const numericSalary = Number(values.salary);
    if (isNaN(numericSalary) || numericSalary <= 0) {
      errors.salary = 'Salary must be a positive number';
    }
  }

  // Status validation
  if (!values.status || !['Active', 'Inactive'].includes(values.status)) {
    errors.status = 'Status must be either Active or Inactive';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (values) => {
  const errors = {};

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
