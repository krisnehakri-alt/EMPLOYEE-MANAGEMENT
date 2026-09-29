import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useToast } from '../hooks/useToast';
import EmployeeForm from '../components/EmployeeForm';

export const AddEmployee = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const created = await employeeService.createEmployee(formData);
      showSuccess(`Employee "${created.name}" created successfully!`);
      navigate('/employees');
    } catch (err) {
      console.error('Failed to create employee:', err);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to create employee record. Please try again.';
      setApiError(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-2">
      <EmployeeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/employees')}
        isLoading={isLoading}
        apiError={apiError}
        isEdit={false}
      />
    </div>
  );
};

export default AddEmployee;
