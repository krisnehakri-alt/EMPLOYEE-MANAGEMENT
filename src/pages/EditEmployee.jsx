import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useToast } from '../hooks/useToast';
import EmployeeForm from '../components/EmployeeForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setFetching(true);
      try {
        const data = await employeeService.getEmployeeById(id);
        setInitialData(data);
      } catch (err) {
        console.error('Failed to fetch employee for edit:', err);
        setNotFound(true);
        const msg = err.response?.data?.message || 'Employee not found';
        showError(msg);
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchEmployeeDetails();
    }
  }, [id, showError]);

  const handleSubmit = async (formData) => {
    setUpdating(true);
    setApiError(null);

    try {
      const updated = await employeeService.updateEmployee(id, formData);
      showSuccess(`Employee "${updated.name}" updated successfully!`);
      navigate(`/employees/${id}`);
    } catch (err) {
      console.error('Failed to update employee:', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to save changes. Please try again.';
      setApiError(msg);
      showError(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Loading employee records for editing..." />
      </div>
    );
  }

  if (notFound || !initialData) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Employee Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The requested employee with ID <span className="font-mono font-bold text-slate-800">{id}</span> does not exist or has been removed.
        </p>
        <Link
          to="/employees"
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      <EmployeeForm
        initialValues={initialData}
        isEdit={true}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/employees/${id}`)}
        isLoading={updating}
        apiError={apiError}
      />
    </div>
  );
};

export default EditEmployee;
