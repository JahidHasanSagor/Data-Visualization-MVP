import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

// We'll simulate React Hook Form behavior since we can't install it in this environment
const useForm = () => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const register = (name, validations = {}) => {
    return {
      name,
      onChange: (e) => {
        const value = e.target.value;
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Validate on change
        if (touched[name]) {
          validateField(name, value, validations);
        }
      },
      onBlur: (e) => {
        const value = e.target.value;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value, validations);
      }
    };
  };

  const validateField = (name, value, validations) => {
    let error = '';
    
    if (validations.required && !value) {
      error = validations.required.message || 'This field is required';
    } else if (validations.pattern && !validations.pattern.value.test(value)) {
      error = validations.pattern.message || 'Invalid format';
    } else if (validations.minLength && value.length < validations.minLength.value) {
      error = validations.minLength.message || `Minimum length is ${validations.minLength.value}`;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleSubmit = (onSubmit) => {
    return (e) => {
      e.preventDefault();
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      
      // Validate all fields
      let isValid = true;
      Object.keys(values).forEach(name => {
        const validations = {};
        if (name === 'email') {
          validations.required = { message: 'Email is required' };
          validations.pattern = { 
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          };
        }
        if (name === 'password') {
          validations.required = { message: 'Password is required' };
          validations.minLength = { 
            value: 6,
            message: 'Password must be at least 6 characters'
          };
        }
        
        const fieldValid = validateField(name, values[name], validations);
        if (!fieldValid) isValid = false;
      });
      
      if (isValid) {
        onSubmit(values);
      }
    };
  };

  return {
    register,
    handleSubmit,
    errors,
    values,
    touched
  };
};

const LoginForm = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useUI();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, errors, touched } = useForm();
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result) {
        showSuccess('Login successful!');
        navigate('/dashboard');
      } else {
        showError('Invalid email or password');
      }
    } catch (error) {
      showError(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to ReportVibe</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
            {...register('email', {
              required: { message: 'Email is required' },
              pattern: { 
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
            {...register('password', {
              required: { message: 'Password is required' },
              minLength: { 
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />
          {touched.password && errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Forgot password?
            </a>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </button>
          
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </a>
      </p>
    </div>
  );
};

export default LoginForm; 