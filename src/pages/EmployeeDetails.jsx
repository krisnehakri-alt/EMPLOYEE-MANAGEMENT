import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { useToast } from '../hooks/useToast';
import EmployeeCard from '../components/EmployeeCard';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const data = await employeeService.getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        console.error('Failed to load employee details:', err);
        const msg = err.response?.data?.message || 'Employee not found';
        showError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id, showError]);

  const handleConfirmDelete = async () => {
    if (!employee) return;
    setIsDeleting(true);

    try {
      await employeeService.deleteEmployee(employee.id);
      showSuccess(`Employee "${employee.name}" deleted successfully`);
      setShowDeleteModal(false);
      navigate('/employees');
    } catch (err) {
      console.error('Failed to delete employee:', err);
      const msg = err.response?.data?.message || 'Failed to delete employee';
      showError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner size="lg" text="Loading employee profile..." />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Employee Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          Unable to locate employee with ID <span className="font-mono font-bold text-slate-800">{id}</span>.
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
      <EmployeeCard
        employee={employee}
        onEdit={(empId) => navigate(`/employees/${empId}/edit`)}
        onDelete={() => setShowDeleteModal(true)}
        onBack={() => navigate('/employees')}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee Record"
        message="Are you sure you want to permanently delete this employee? This will purge all associated payroll, department, and account records."
        employeeInfo={employee}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EmployeeDetails;
